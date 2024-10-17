const modal = document.querySelector("#modal");
const modalOpenBtn = document.querySelector("#modal-open-btn");
const closeModalBtn = document.querySelector("#modal-close-btn");
const saveModalBtn = document.querySelector("#modal-save-btn");
const modalDataField = document.querySelector("#modal-data");

const nonModal = document.querySelector("#non-modal");
const nonModalOpenBtn = document.querySelector("#non-modal-open-btn");
const closeNonModalBtn = document.querySelector("#non-modal-close-btn");
const saveNonModalBtn = document.querySelector("#non-modal-save-btn");
const nonModalDataField = document.querySelector("#non-modal-data");

modalOpenBtn?.addEventListener("click", () => {
	if (!modal) return;
	modal.showModal();
});

saveModalBtn?.addEventListener("click", () => {
	if (!modal) return;
	modal.close(modalDataField.value);
});

closeModalBtn?.addEventListener("click", () => {
	modal?.close();
});

nonModalOpenBtn?.addEventListener("click", () => {
	if (!nonModal) return;
	nonModal.show();
});

saveNonModalBtn?.addEventListener("click", () => {
	if (!nonModal) return;
	nonModal.close(nonModalDataField.value);
});

closeNonModalBtn?.addEventListener("click", () => {
	nonModal?.close();
});

modal?.addEventListener("close", e => {
	console.log(
		"Data returned from the modal dialog: ",
		modal?.returnValue
	);
})

nonModal?.addEventListener("close", e => {
	console.log(
		"Data returned from the non-modal dialog: ",
		nonModal?.returnValue
	);
})