#!/bin/bash

dir=$(dirname $1)
file=$(basename $1)
cd $dir

# アイコンのオリジナルデータから各種サイズのアイコンを生成
sizes=(512 256 128 64 32 16)
for s in ${sizes[@]}
do
  convert $file -resize "${s}x${s}" "${s}.png"
done

# ratina用に2倍サイズのアイコンを追加
x2sizes=(512 256)
for s in ${x2sizes[@]}
do
  cp "${s}.png" "$((s / 2))@2x.png"
done

# iconsファイルを作成
npx icon-gen -i . -o . -r \
  --ico --ico-name icon --ico-sizes 16,32,64,128,256\
  --icns --icns-name icon --icns-sizes 16,32,64,128,256,512
