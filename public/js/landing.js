document.addEventListener('DOMContentLoaded', () => {
    const proceedButton = document.getElementById('proceedButton');

    if (proceedButton) {
        proceedButton.addEventListener('click', () => {
            // Redirect to the main chat application page, now under /app
            window.location.href = '/app'; 
        });
    }
});
