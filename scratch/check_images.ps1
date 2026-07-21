Add-Type -AssemblyName System.Drawing
$assetsDir = "c:\Users\adity\OneDrive\Desktop\Jitvan's Stuff\peora\assets"
Get-ChildItem (Join-Path $assetsDir "*.png") | ForEach-Object {
    $img = [System.Drawing.Image]::FromFile($_.FullName)
    [PSCustomObject]@{
        Name = $_.Name
        Width = $img.Width
        Height = $img.Height
        SizeMB = [Math]::Round($_.Length / 1MB, 2)
    }
    $img.Dispose()
}
