Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.Rate = 0  # Normal speed

$jsonPath = "data/sorani_basics_50.json"
$rawJson = Get-Content -Path $jsonPath -Raw -Encoding UTF8
$words = $rawJson | ConvertFrom-Json

$audioDir = "public/audio"
if (!(Test-Path $audioDir)) {
    New-Item -ItemType Directory -Path $audioDir | Out-Null
}

$generated = 0
$skipped = 0

foreach ($item in $words) {
    $text = $item.englishText.Trim()
    # Clean slug for filename
    $slug = $text.ToLower() -replace '[^a-z0-9]+', '_' -replace '^_+|_+$', ''
    $filename = "$slug.mp3"
    $mp3Path = "$audioDir/$filename"
    $wavPath = "$audioDir/$slug.wav"

    if (!(Test-Path $mp3Path)) {
        Write-Output "Generating English audio for: '$text' -> $filename"
        $synth.SetOutputToWaveFile($wavPath)
        $synth.Speak($text)
        $synth.SetOutputToDefaultAudioDevice()

        # Convert to MP3
        & ffmpeg -y -i $wavPath -codec:a libmp3lame -qscale:a 2 $mp3Path 2>$null
        if (Test-Path $wavPath) { Remove-Item $wavPath }
        $generated++
    } else {
        $skipped++
    }

    # Set the englishAudioUrl
    $item.englishAudioUrl = "/audio/$filename"
}

# Save updated JSON
$updatedJson = $words | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText((Resolve-Path $jsonPath), $updatedJson, [System.Text.Encoding]::UTF8)

Write-Output ""
Write-Output "=== English Audio Generation Summary ==="
Write-Output "Newly generated: $generated"
Write-Output "Already existed: $skipped"
Write-Output "Total English audio entries in dataset: $($words.Count)"
