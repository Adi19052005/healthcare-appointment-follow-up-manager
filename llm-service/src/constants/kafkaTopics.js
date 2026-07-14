/* ==========================================
   LLM Kafka Topics
========================================== */

module.exports = {

    // Published by Backend
    SYMPTOMS_SUBMITTED: "symptoms.submitted",

    CLINICAL_NOTES_ADDED: "clinical.notes.added",
    PRESCRIPTION_ADDED: "prescription.added",

    // Optional Future Topics (if you want other services to react)
    PRE_VISIT_SUMMARY_GENERATED: "previsit.summary.generated",

    POST_VISIT_SUMMARY_GENERATED: "postvisit.summary.generated"

};