import React from "react";
import Panel from "./core/Panel";
import { Edit, Trash2 } from "lucide-react";

const PayloadBatchesPanel = ({
  payloadBatches,
  totalBatchedCount,
  totalRequests,
  editingBatchIndex,
  showNewGroup,
  handleStartEdit,
  handleDeleteBatch,
  handleSaveBatch,
  handleCancelEdit,
  handleAddNewGroup,
  PayloadEntryGroupComponent,
}) => (
  <Panel
    title={`Payload Batches (${totalBatchedCount} / ${totalRequests} Requests Configured)`}
  >
    <div className="space-y-4">
      {payloadBatches.map((batch, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg flex justify-between items-center transition-all ${
            editingBatchIndex === index
              ? "bg-cyan-900/50 ring-2 ring-cyan-500"
              : "bg-slate-700/50"
          }`}
        >
          <span className="text-sm">
            Batch {index + 1}
          </span>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-cyan-400">
              {batch.count} requests
            </span>
            <button
              onClick={() => handleStartEdit(index)}
              className="p-1 text-slate-400 hover:text-white"
              title="Edit Batch"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDeleteBatch(index)}
              className="p-1 text-slate-400 hover:text-red-500"
              title="Delete Batch"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>

    {(showNewGroup || editingBatchIndex !== null) && (
      <div className="mt-4">
        {PayloadEntryGroupComponent ? (
          <PayloadEntryGroupComponent
            isMultiRequest={true}
            key={editingBatchIndex ?? "new"}
            onSave={handleSaveBatch}
            onCancel={handleCancelEdit}
            initialData={
              editingBatchIndex !== null
                ? payloadBatches[editingBatchIndex]
                : null
            }
            maxAddableCount={
              totalRequests -
              totalBatchedCount +
              (editingBatchIndex !== null
                ? payloadBatches[editingBatchIndex].count
                : 0)
            }
          />
        ) : (
          // fallback to default import if not provided
          <React.Fragment>
            {/* You can import and use the default PayloadEntryGroup here if needed */}
          </React.Fragment>
        )}
      </div>
    )}

    {!showNewGroup && editingBatchIndex === null && (
      <button
        onClick={handleAddNewGroup}
        disabled={totalBatchedCount >= totalRequests}
        className="mt-4 w-full border-2 border-dashed border-slate-600 hover:border-cyan-500 text-slate-300 font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        + Add New Payload Group
      </button>
    )}
  </Panel>
);

export default PayloadBatchesPanel;
