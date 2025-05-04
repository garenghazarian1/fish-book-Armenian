import IntroScene from "@/components/mainPage/IntroScene";
import Happy from "@/components/pages/Happy/Happy";

export default function Home() {
  return (
    <>
      <div className="scrollContainer">
        <IntroScene />
        <Happy />
      </div>
    </>
  );
}
