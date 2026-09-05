Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer

$words = @(
    @{ name = "hello"; text = "Hello" },
    @{ name = "thank_you"; text = "Thank you" },
    @{ name = "good_morning"; text = "Good morning" },
    @{ name = "water"; text = "Water" },
    @{ name = "bread"; text = "Bread" },
    @{ name = "slaw"; text = "Slaw" },
    @{ name = "supas"; text = "Supas" },
    @{ name = "beyani_bash"; text = "Bayanee bash" },
    @{ name = "aw"; text = "Aaw" },
    @{ name = "nan"; text = "Naan" }
)

foreach ($w in $words) {
    $wavPath = "public/audio/$($w.name).wav"
    $mp3Path = "public/audio/$($w.name).mp3"
    $synth.SetOutputToWaveFile($wavPath)
    $synth.Speak($w.text)
    $synth.SetOutputToDefaultAudioDevice()
    
    # Convert WAV to standard MP3 with ffmpeg
    & ffmpeg -y -i $wavPath -codec:a libmp3lame -qscale:a 2 $mp3Path 2>$null
    if (Test-Path $wavPath) { Remove-Item $wavPath }
    Write-Output "Generated $mp3Path"
}
