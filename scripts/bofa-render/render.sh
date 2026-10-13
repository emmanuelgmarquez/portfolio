#!/bin/bash
# Renders every email in ./emails at desktop (820px) and mobile (375px) width
# using your installed Google Chrome, then zips the results to bofa-renders.zip.
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$CHROME" ] || CHROME="$HOME/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [ ! -x "$CHROME" ]; then echo "Google Chrome not found. Install Chrome, then run this again."; exit 1; fi
mkdir -p out/desktop out/mobile
total=$(wc -l < list.txt | tr -d ' '); n=0
render() { # $1 url  $2 out  $3 width  $4 height
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --mute-audio \
    --force-device-scale-factor=2 --window-size="$3,$4" --virtual-time-budget=6000 \
    --run-all-compositor-stages-before-draw --default-background-color=FFFFFFFF \
    --allow-file-access-from-files --screenshot="$2" "$1" >/dev/null 2>&1
}
while IFS= read -r f; do
  n=$((n+1)); name=$(echo "$f" | sed 's|/|__|g; s|\.html$||')
  printf "\r[%d/%d] %s                    " "$n" "$total" "$(basename "$f")"
  enc=$(printf '%s' "$f" | sed 's/%/%25/g; s/ /%20/g; s/#/%23/g; s/?/%3F/g; s/&/%26/g')
  [ -f "out/desktop/$name.png" ] || render "file://$PWD/emails/$enc" "out/desktop/$name.png" 820 7400
  # Chrome windows can't go narrower than ~500px, so mobile renders inside a 375px iframe.
  [ -f "out/mobile/$name.png" ]  || render "file://$PWD/mobile.html?$enc" "out/mobile/$name.png" 600 9600
done < list.txt
echo; echo "Zipping…"
rm -f bofa-renders.zip; (cd out && zip -qr ../bofa-renders.zip desktop mobile)
echo "Done: $(ls out/desktop | wc -l | tr -d ' ') desktop and $(ls out/mobile | wc -l | tr -d ' ') mobile renders in bofa-renders.zip"
