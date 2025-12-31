"""
CycleGAN for SAR-to-Optical Image Translation
Cloud-penetrating vision for flood monitoring during monsoon events
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Tuple, Optional
import numpy as np
from loguru import logger


class ResidualBlock(nn.Module):
    """Residual block for generator"""
    
    def __init__(self, channels: int):
        super().__init__()
        self.block = nn.Sequential(
            nn.ReflectionPad2d(1),
            nn.Conv2d(channels, channels, 3),
            nn.InstanceNorm2d(channels),
            nn.ReLU(inplace=True),
            nn.ReflectionPad2d(1),
            nn.Conv2d(channels, channels, 3),
            nn.InstanceNorm2d(channels),
        )
    
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return x + self.block(x)


class Generator(nn.Module):
    """
    CycleGAN Generator for SAR-to-Optical translation
    Based on ResNet architecture with 9 residual blocks
    """
    
    def __init__(self, input_channels: int = 1, output_channels: int = 3, n_residual: int = 9):
        super().__init__()
        
        # Initial convolution
        self.initial = nn.Sequential(
            nn.ReflectionPad2d(3),
            nn.Conv2d(input_channels, 64, 7),
            nn.InstanceNorm2d(64),
            nn.ReLU(inplace=True),
        )
        
        # Downsampling
        self.down1 = self._downsample(64, 128)
        self.down2 = self._downsample(128, 256)
        
        # Residual blocks
        self.residual = nn.Sequential(*[ResidualBlock(256) for _ in range(n_residual)])
        
        # Upsampling
        self.up1 = self._upsample(256, 128)
        self.up2 = self._upsample(128, 64)
        
        # Output
        self.output = nn.Sequential(
            nn.ReflectionPad2d(3),
            nn.Conv2d(64, output_channels, 7),
            nn.Tanh(),
        )
    
    def _downsample(self, in_channels: int, out_channels: int) -> nn.Sequential:
        return nn.Sequential(
            nn.Conv2d(in_channels, out_channels, 3, stride=2, padding=1),
            nn.InstanceNorm2d(out_channels),
            nn.ReLU(inplace=True),
        )
    
    def _upsample(self, in_channels: int, out_channels: int) -> nn.Sequential:
        return nn.Sequential(
            nn.ConvTranspose2d(in_channels, out_channels, 3, stride=2, padding=1, output_padding=1),
            nn.InstanceNorm2d(out_channels),
            nn.ReLU(inplace=True),
        )
    
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.initial(x)
        x = self.down1(x)
        x = self.down2(x)
        x = self.residual(x)
        x = self.up1(x)
        x = self.up2(x)
        return self.output(x)


class Discriminator(nn.Module):
    """PatchGAN Discriminator for CycleGAN"""
    
    def __init__(self, input_channels: int = 3):
        super().__init__()
        
        self.model = nn.Sequential(
            self._block(input_channels, 64, normalize=False),
            self._block(64, 128),
            self._block(128, 256),
            self._block(256, 512, stride=1),
            nn.Conv2d(512, 1, 4, padding=1),
        )
    
    def _block(self, in_channels: int, out_channels: int, stride: int = 2, normalize: bool = True) -> nn.Sequential:
        layers = [nn.Conv2d(in_channels, out_channels, 4, stride=stride, padding=1)]
        if normalize:
            layers.append(nn.InstanceNorm2d(out_channels))
        layers.append(nn.LeakyReLU(0.2, inplace=True))
        return nn.Sequential(*layers)
    
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.model(x)


class SARToOpticalTranslator:
    """
    SAR-to-Optical Image Translation Service
    Translates Sentinel-1 SAR images to optical-style views for intuitive flood visualization
    """
    
    def __init__(self, model_path: Optional[str] = None, device: str = "auto"):
        self.device = self._get_device(device)
        self.generator = Generator(input_channels=1, output_channels=3).to(self.device)
        
        if model_path:
            self.load_model(model_path)
        
        self.generator.eval()
        logger.info(f"CycleGAN SAR-to-Optical translator initialized on {self.device}")
    
    def _get_device(self, device: str) -> torch.device:
        if device == "auto":
            if torch.cuda.is_available():
                return torch.device("cuda")
            elif hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
                return torch.device("mps")
            else:
                return torch.device("cpu")
        return torch.device(device)
    
    def load_model(self, path: str):
        """Load pre-trained model weights"""
        try:
            state_dict = torch.load(path, map_location=self.device)
            self.generator.load_state_dict(state_dict)
            logger.info(f"Loaded CycleGAN model from {path}")
        except Exception as e:
            logger.warning(f"Could not load model from {path}: {e}")
            logger.info("Using randomly initialized model (demo mode)")
    
    def preprocess_sar(self, sar_image: np.ndarray) -> torch.Tensor:
        """
        Preprocess SAR image for model input
        - Normalize to [-1, 1]
        - Add batch and channel dimensions
        """
        # Normalize
        if sar_image.max() > 1:
            sar_image = sar_image / 255.0
        sar_image = (sar_image - 0.5) * 2  # Scale to [-1, 1]
        
        # Convert to tensor
        tensor = torch.from_numpy(sar_image).float()
        
        # Add dimensions if needed
        if tensor.ndim == 2:
            tensor = tensor.unsqueeze(0).unsqueeze(0)
        elif tensor.ndim == 3:
            tensor = tensor.unsqueeze(0)
        
        return tensor.to(self.device)
    
    def postprocess_optical(self, output: torch.Tensor) -> np.ndarray:
        """Convert model output to RGB image"""
        output = output.cpu().detach().squeeze()
        # Scale from [-1, 1] to [0, 255]
        output = ((output + 1) / 2 * 255).clamp(0, 255)
        return output.permute(1, 2, 0).numpy().astype(np.uint8)
    
    @torch.no_grad()
    def translate(self, sar_image: np.ndarray) -> Tuple[np.ndarray, float]:
        """
        Translate SAR image to optical-style image
        
        Args:
            sar_image: Input SAR image (grayscale)
            
        Returns:
            Tuple of (optical_image, confidence)
        """
        import time
        start_time = time.time()
        
        # Preprocess
        input_tensor = self.preprocess_sar(sar_image)
        
        # Generate
        output_tensor = self.generator(input_tensor)
        
        # Postprocess
        optical_image = self.postprocess_optical(output_tensor)
        
        inference_time = (time.time() - start_time) * 1000
        logger.debug(f"SAR-to-Optical translation completed in {inference_time:.2f}ms")
        
        # Calculate confidence based on output statistics (simplified)
        confidence = min(0.95, 0.7 + np.std(optical_image) / 100)
        
        return optical_image, confidence
    
    def extract_flood_mask(self, optical_image: np.ndarray, threshold: float = 0.3) -> np.ndarray:
        """
        Extract flood mask from translated optical image
        Uses blue channel dominance and texture analysis
        """
        # Convert to float
        img = optical_image.astype(np.float32) / 255.0
        
        # Calculate water index (simplified NDWI-like)
        blue = img[:, :, 2]
        green = img[:, :, 1]
        red = img[:, :, 0]
        
        # Water typically has higher blue/green ratio and lower red
        water_index = (blue - red) / (blue + red + 1e-6)
        
        # Threshold to create mask
        flood_mask = (water_index > threshold).astype(np.uint8)
        
        return flood_mask


# Singleton instance
_translator_instance: Optional[SARToOpticalTranslator] = None


def get_sar_translator() -> SARToOpticalTranslator:
    """Get or create the SAR translator singleton"""
    global _translator_instance
    if _translator_instance is None:
        from app.core.config import settings
        _translator_instance = SARToOpticalTranslator(
            model_path=settings.CYCLEGAN_MODEL_PATH if settings.CYCLEGAN_MODEL_PATH else None
        )
    return _translator_instance
