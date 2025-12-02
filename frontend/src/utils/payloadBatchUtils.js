// Utility functions for payload batch management in MultiRequestPage and similar pages

/**
 * Save a batch, merging with old batch if editing, or adding new batch otherwise.
 */
export function handleSaveBatch({
  batch,
  editingBatchIndex,
  payloadBatches,
  totalBatchedCount,
  totalRequests,
  setPayloadBatches,
  setEditingBatchIndex,
  setShowNewGroup,
}) {
  const isEditing = editingBatchIndex !== null;

  if (isEditing) {
    const currentBatchCount = payloadBatches[editingBatchIndex].count;
    if (totalBatchedCount - currentBatchCount + batch.count > totalRequests) {
      alert("This update exceeds the total requests limit.");
      return;
    }
    const updatedBatches = [...payloadBatches];
    updatedBatches[editingBatchIndex] = batch;
    setPayloadBatches(updatedBatches);
    setEditingBatchIndex(null);
  } else {
    if (totalBatchedCount + batch.count > totalRequests) {
      alert(
        `Adding this batch would exceed the total of ${totalRequests} requests.`
      );
      return;
    }
    setPayloadBatches((prev) => [...prev, batch]);
    setShowNewGroup(false);
  }
}

/**
 * Cancel editing a batch.
 */
export function handleCancelEdit({ setEditingBatchIndex, setShowNewGroup }) {
  setEditingBatchIndex(null);
  setShowNewGroup(false);
}

/**
 * Delete a batch by index.
 */
export function handleDeleteBatch({
  index,
  payloadBatches,
  setPayloadBatches,
  editingBatchIndex,
  setEditingBatchIndex,
}) {
  if (window.confirm("Are you sure you want to delete this batch?")) {
    setPayloadBatches((prev) => prev.filter((_, i) => i !== index));
    if (editingBatchIndex === index) {
      setEditingBatchIndex(null);
    }
  }
}

/**
 * Start editing a batch by index.
 */
export function handleStartEdit({
  index,
  setEditingBatchIndex,
  setShowNewGroup,
}) {
  setEditingBatchIndex(index);
  setShowNewGroup(false); // Hide new group form when editing
}

/**
 * Add a new batch group.
 */
export function handleAddNewGroup({ setEditingBatchIndex, setShowNewGroup }) {
  setEditingBatchIndex(null);
  setShowNewGroup(true);
}
