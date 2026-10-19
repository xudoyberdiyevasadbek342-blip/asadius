export type Slide = {
  // Ekranda chiqadigan matn
  text: string;
  // Matn ustidagi katta emoji (ixtiyoriy)
  emoji?: string;
  // Necha soniya turadi (standart: 3)
  seconds?: number;
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
  slides: Slide[];
};
