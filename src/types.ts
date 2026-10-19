export type Slide = {
  // Ekranda chiqadigan matn
  text: string;
  // Matn ustidagi katta emoji (ixtiyoriy)
  emoji?: string;
  // Necha soniya turadi (standart: 3)
  seconds?: number;
};

export type Word = { text: string; start: number; end: number };

// scripts/prepare.py tayyorlagan AI sahna
export type Scene = {
  text: string;
  audio: string;
  image: string | null;
  words: Word[];
  seconds: number;
};

export type ReelProps = {
  // Rang mavzusi: "binafsha", "kok", "olov", "yashil", "tun"
  theme?: string;
  // Pastda chiqadigan Instagram nomi
  handle?: string;
  // public/ papkasidagi musiqa fayli nomi (ixtiyoriy), masalan "musiqa.mp3"
  music?: string;
  // Instagram uchun izoh va hashtaglar (videoga chiqmaydi)
  caption?: string;
  // Birinchi sahnada yuqorida chiqadigan sarlavha (ixtiyoriy)
  title?: string;
  // Oddiy matnli video uchun
  slides?: Slide[];
  // AI ovozli video uchun
  scenes?: Scene[];
};
