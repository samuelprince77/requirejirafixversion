const ACTION_BUTTON_ID = "issue-workflow-transition-submit"
const EXPECTED_ACTION_BUTTON_TEXT_1 = "Resolve Issue"
const EXPECTED_ACTION_BUTTON_TEXT_2 = "Resolve"
const FIX_VERSIONS_CLASS_NAME = "item-row"

let actionButton = null
let fixVersions = null

new MutationSummary({
    rootNode: document.body,
    callback: function (summaries) {
        // Button is removed when the dialog is closed
        let actionButtonRemoved = false
        let fixVersionRemoved = false

        summaries.forEach(function (summary) {
            if (summary.added.length > 0) {
                let elementOfInterest = summary.added[0]
                if (elementOfInterest.classList.contains(FIX_VERSIONS_CLASS_NAME)) {
                    fixVersions = elementOfInterest
                } else if (elementOfInterest.id === ACTION_BUTTON_ID &&
                    (elementOfInterest.attributes.getNamedItem("value").value === EXPECTED_ACTION_BUTTON_TEXT_1 ||
                        elementOfInterest.attributes.getNamedItem("value").value === EXPECTED_ACTION_BUTTON_TEXT_2
                    )
                ) {
                    actionButton = elementOfInterest
                }
            } else if (summary.removed.length > 0) {
                if (summary.removed[0].classList.contains(FIX_VERSIONS_CLASS_NAME)) {
                    fixVersionRemoved = true
                } else {
                    actionButtonRemoved = true
                }
            }
        })

        if (actionButton !== null) {
            // A fix version was removed but a new one was not set
            if (fixVersionRemoved && !actionButtonRemoved) {
                fixVersions = null
            }

            actionButton.onclick = function (event) {
                if (fixVersions == null) {
                    let confirmation = confirm(
                        "Yo! It looks like you forgot to add a fix version to the issue!\n " +
                        "Press OK to ignore and proceed or cancel to fix the issue!"
                    )
                    if (!confirmation) {
                        // If the action is cancelled from the dialog, short circuit the event propagation
                        // User can fix the issue
                        event.preventDefault()
                        event.stopPropagation()
                    } else {
                        actionButton = null
                        fixVersions = null
                    }
                }
            }
        }
    },
    queries: [
        {element: ".item-row"},
        {element: "#issue-workflow-transition-submit"}
    ]
});