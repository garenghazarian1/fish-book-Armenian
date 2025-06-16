"use client";

interface Props {
  model: string | undefined;
}

export default function DownloadFishBookButton({ model }: Props) {
  const download = () => {
    if (!model) return;
    const url = `/BooksPdf/${model}-fishbook.pdf`;
    window.open(url, "_blank");
  };

  return (
    <button
      onClick={download}
      style={{
        marginTop: "1.5rem",
        padding: "12px 24px",
        fontSize: "1rem",
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        color: "white",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
      }}
    >
      📘 Ներբեռնել ձկան գրքույկը
    </button>
  );
}
