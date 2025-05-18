interface Mood {
  id: string;
  image: string;
  text: string;
  audio: string;
}
const moods: Mood[] = [
  {
    id: "happy",
    image: "/fishDikoGerman/glücklich.png",
    text: "Ich bin Glücklich",
    audio: "/sounds/dikoAudioReadyGerman/ichBinGlücklich.mp3",
  },
  {
    id: "angry",
    image: "/fishDikoGerman/böse.png",
    text: "Ich bin Böse",
    audio: "/sounds/dikoAudioReadyGerman/ichBinBöse.mp3",
  },
  {
    id: "astonished",
    image: "/fishDikoGerman/erstaunt.png",
    text: "Ich bin Erstaunt",
    audio: "/sounds/dikoAudioReadyGerman/ichBinErstaunt.mp3",
  },
  {
    id: "bored",
    image: "/fishDikoGerman/gelangweilt.png",
    text: "Ich bin Gelangweilt",
    audio: "/sounds/dikoAudioReadyGerman/ichBinGelangweilt.mp3",
  },
  {
    id: "brave",
    image: "/fishDikoGerman/mutig.png",
    text: "Ich bin Mutig",
    audio: "/sounds/dikoAudioReadyGerman/ichBinMutig.mp3",
  },
  {
    id: "carefree",
    image: "/fishDikoGerman/sorglos.png",
    text: "Ich bin Sorglos",
    audio: "/sounds/dikoAudioReadyGerman/ichBinSorglos.mp3",
  },
  {
    id: "confused",
    image: "/fishDikoGerman/nervös.png",
    text: "Ich bin Nervös",
    audio: "/sounds/dikoAudioReadyGerman/ichBinNervös.mp3",
  },
  {
    id: "embarrassed",
    image: "/fishDikoGerman/verlegen.png",
    text: "Ich bin Verlegen",
    audio: "/sounds/dikoAudioReadyGerman/ichBinVerlegen.mp3",
  },
  {
    id: "envious",
    image: "/fishDikoGerman/betrübt.png",
    text: "Ich bin Betrübt",
    audio: "/sounds/dikoAudioReadyGerman/ichBinBetrübt.mp3",
  },
  {
    id: "evil",
    image: "/fishDikoGerman/zornig.png",
    text: "Ich bin Zornig",
    audio: "/sounds/dikoAudioReadyGerman/ichBinZornig.mp3",
  },
  {
    id: "frightened",
    image: "/fishDikoGerman/erschrocken.png",
    text: "Ich bin Erschrocken",
    audio: "/sounds/dikoAudioReadyGerman/ichBinErschrocken.mp3",
  },
  {
    id: "inLove",
    image: "/fishDikoGerman/verliebt.png",
    text: "Ich bin Verliebt",
    audio: "/sounds/dikoAudioReadyGerman/ichBinVerliebt.mp3",
  },
  {
    id: "proud",
    image: "/fishDikoGerman/stolz.png",
    text: "Ich bin Stolz",
    audio: "/sounds/dikoAudioReadyGerman/ichBinStolz.mp3",
  },
];

export default moods;
