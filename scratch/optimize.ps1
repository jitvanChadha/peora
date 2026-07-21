Add-Type -AssemblyName System.Drawing

$assetsDir = "c:\Users\adity\OneDrive\Desktop\Jitvan's Stuff\peora\assets"

function Resize-Image {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [int]$TargetWidth,
        [string]$Format
    )
    
    $src = [System.Drawing.Image]::FromFile($InputPath)
    $ratio = $src.Height / $src.Width
    $targetHeight = [int]($TargetWidth * $ratio)
    
    $bmp = New-Object System.Drawing.Bitmap($TargetWidth, $targetHeight)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    $g.DrawImage($src, 0, 0, $TargetWidth, $targetHeight)
    
    if ($Format -eq "JPEG") {
        $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 85)
        $bmp.Save($OutputPath, $codec, $encoderParams)
    } else {
        $bmp.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    }
    
    $g.Dispose()
    $bmp.Dispose()
    $src.Dispose()
}

# 1. Convert hero background from PNG (2.07 MB) to JPEG (~120 KB)
Write-Host "Optimizing background image..."
Resize-Image -InputPath (Join-Path $assetsDir "bottleBeach.png") -OutputPath (Join-Path $assetsDir "bottleBeach.jpg") -TargetWidth 1672 -Format "JPEG"

# 2. Resize and optimize product cutout PNGs to 400px width (drops size from 1.8 MB to ~60 KB each)
Write-Host "Optimizing product cutouts..."
Resize-Image -InputPath (Join-Path $assetsDir "bottle_500ml_cutout.png") -OutputPath (Join-Path $assetsDir "bottle_500ml_cutout_opt.png") -TargetWidth 400 -Format "PNG"
Resize-Image -InputPath (Join-Path $assetsDir "bottle_1litre_cutout.png") -OutputPath (Join-Path $assetsDir "bottle_1litre_cutout_opt.png") -TargetWidth 400 -Format "PNG"
Resize-Image -InputPath (Join-Path $assetsDir "jar_20litre_cutout.png") -OutputPath (Join-Path $assetsDir "jar_20litre_cutout_opt.png") -TargetWidth 400 -Format "PNG"

# Replace original cutouts with optimized versions
Move-Item -Path (Join-Path $assetsDir "bottle_500ml_cutout_opt.png") -Destination (Join-Path $assetsDir "bottle_500ml_cutout.png") -Force
Move-Item -Path (Join-Path $assetsDir "bottle_1litre_cutout_opt.png") -Destination (Join-Path $assetsDir "bottle_1litre_cutout.png") -Force
Move-Item -Path (Join-Path $assetsDir "jar_20litre_cutout_opt.png") -Destination (Join-Path $assetsDir "jar_20litre_cutout.png") -Force

Write-Host "Image optimization completed successfully!"
