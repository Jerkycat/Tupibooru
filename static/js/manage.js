document.addEventListener('DOMContentLoaded', (event) => {    
    // Switch between tabs
    const options = document.querySelectorAll('.popup-manage-option');
    options.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options
            options.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            option.classList.add('active');
            
            // Hide all tabs
            document.querySelectorAll('.popup-manage-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab
            const tabName = option.getAttribute('data-option');
            document.querySelector(`.popup-manage-tab[data-tab="${tabName}"]`).classList.add('active');
        });
    });
    
    // Add moderator functionality
    document.querySelectorAll('.add-moderator').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const moderatorName = input.value.trim();
            
            if (moderatorName) {
                const moderatorList = this.closest('.side-content').querySelector('.moderator-list');
                
                const moderatorItem = document.createElement('div');
                moderatorItem.className = 'moderator-item';
                moderatorItem.innerHTML = `
                    <span>${moderatorName}</span>
                    <button type="button" class="remove-moderator">X</button>
                `;
                
                moderatorList.appendChild(moderatorItem);
                input.value = '';
                
                // Add event listener to the new remove button
                moderatorItem.querySelector('.remove-moderator').addEventListener('click', function() {
                    this.closest('.moderator-item').remove();
                });
            }
        });
    });
    
    // Remove moderator functionality
    document.querySelectorAll('.remove-moderator').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.moderator-item').remove();
        });
    });
});