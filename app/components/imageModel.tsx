interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

function ImageModal({ imageUrl, onClose }: ImageModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()} // Modal ichiga bosganda yopilmasin
      >
        <img
          src={imageUrl}
          alt="Enlarged preview"
          className="max-w-full max-h-[80vh] rounded-lg border"
        />
        <button
          className="absolute top-2 right-2 text-white text-2xl font-bold bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-80"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
}

export default ImageModal;
