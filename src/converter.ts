const BaseDPI = 96;

type Option = {
  dpi?: number
  backgroundColor?: string
}
export const svg2png = async (svg: string, { dpi = 300, backgroundColor = '#f6f6f6' }: Option = {}) => {
  try {
    const image = await loadImage('data:image/svg+xml;base64,' + convertSvgToBase64(svg));

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    const scale = dpi / BaseDPI;

    canvas.width = image.width * scale;
    canvas.height = image.height * scale;
    context.scale(scale, scale)
    context.imageSmoothingQuality = 'high'

    context.fillStyle = backgroundColor
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.drawImage(image, 0, 0);

    const dataUrl = canvas.toDataURL('image/png'); // 画像フォーマットを指定します
    const base64Data = dataUrl.split(',')[1];
    const binaryString = atob(base64Data);
    const length = binaryString.length;
    const blob = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      blob[i] = binaryString.charCodeAt(i);
    }

    return blob
  } catch (error) {
    // エラーハンドリング
    console.error('画像の読み込み中にエラーが発生しました:', error);
  }
}

const loadImage = async (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      resolve(image);
    };

    image.onerror = (error) => {
      reject(error);
    };

    image.src = url;
  });
}

const convertSvgToBase64 = (svgData: string): string => {
  const encoder = new TextEncoder();
  const svgDataBytes = encoder.encode(svgData);
  const base64EncodedData = base64FromArrayBuffer(svgDataBytes);
  return base64EncodedData;
}

const base64FromArrayBuffer = (arrayBuffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(arrayBuffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
