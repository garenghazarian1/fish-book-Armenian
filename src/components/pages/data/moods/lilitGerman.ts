interface Mood {
  id: string;
  image: string;
  text: string;
  audio: string;
}
const moods: Mood[] = [
  {
    id: "happy",
    image: "/fishLilitGerman/glücklich.png",
    text: "Ich bin Glücklich",
    audio: "/sounds/lilitAudioReadyGerman/ichBinGlücklich.mp3",
  },
  {
    id: "angry",
    image: "/fishLilitGerman/böse.png",
    text: "Ich bin Böse",
    audio: "/sounds/lilitAudioReadyGerman/ichBinBöse.mp3",
  },
  {
    id: "astonished",
    image: "/fishLilitGerman/erstaunt.png",
    text: "Ich bin Erstaunt",
    audio: "/sounds/lilitAudioReadyGerman/ichBinErstaunt.mp3",
  },
  {
    id: "bored",
    image: "/fishLilitGerman/gelangweilt.png",
    text: "Ich bin Gelangweilt",
    audio: "/sounds/lilitAudioReadyGerman/ichBinGelangweilt.mp3",
  },
  {
    id: "brave",
    image: "/fishLilitGerman/mutig.png",
    text: "Ich bin Mutig",
    audio: "/sounds/lilitAudioReadyGerman/ichBinMutig.mp3",
  },
  {
    id: "carefree",
    image: "/fishLilitGerman/sorglos.png",
    text: "Ich bin Sorglos",
    audio: "/sounds/lilitAudioReadyGerman/ichBinSorglos.mp3",
  },
  {
    id: "confused",
    image: "/fishLilitGerman/nervös.png",
    text: "Ich bin Nervös",
    audio: "/sounds/lilitAudioReadyGerman/ichBinNervös.mp3",
  },
  {
    id: "embarrassed",
    image: "/fishLilitGerman/verlegen.png",
    text: "Ich bin Verlegen",
    audio: "/sounds/lilitAudioReadyGerman/ichBinVerlegen.mp3",
  },
  {
    id: "envious",
    image: "/fishLilitGerman/betrübt.png",
    text: "Ich bin Betrübt",
    audio: "/sounds/lilitAudioReadyGerman/ichBinBetrübt.mp3",
  },
  {
    id: "evil",
    image: "/fishLilitGerman/zornig.png",
    text: "Ich bin Zornig",
    audio: "/sounds/lilitAudioReadyGerman/ichBinZornig.mp3",
  },
  {
    id: "frightened",
    image: "/fishLilitGerman/erschrocken.png",
    text: "Ich bin Erschrocken",
    audio: "/sounds/lilitAudioReadyGerman/ichBinErschrocken.mp3",
  },
  {
    id: "inLove",
    image: "/fishLilitGerman/verliebt.png",
    text: "Ich bin Verliebt",
    audio: "/sounds/lilitAudioReadyGerman/ichBinVerliebt.mp3",
  },
  {
    id: "proud",
    image: "/fishLilitGerman/stolz.png",
    text: "Ich bin Stolz",
    audio: "/sounds/lilitAudioReadyGerman/ichBinStolz.mp3",
  },
];

export default moods;
