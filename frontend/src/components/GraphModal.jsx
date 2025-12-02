import React from "react";
import Modal from "./core/Modal";

const GraphModal = ({ isOpen, onClose, graphData, title }) => {
  if (!graphData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title ={title}>
      {/* <div className="bg-slate-800 rounded-lg p-6 w-full max-w-4xl mx-auto"> */}
        <div className="rounded-lg p-4 overflow-auto max-h-[65vh] -mt-10">
          <img
            src={`data:image/png;base64,${graphData}`}
            alt="Graph Visualization"
            className="max-w-full h-auto mx-auto"
          />
        </div>
      {/* </div> */}
    </Modal>
  );
};

export default GraphModal;
