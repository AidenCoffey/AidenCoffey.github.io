const itemsList = {
    list1: [
        { name: 'Copper Cables', id: 'copper-cables' },
        { name: 'Bolt', id: 'bolt' },
        { name: 'Screws', id: 'screws' },
        { name: 'PlayDates', id: 'play'}
    ],
    list2: [
        { name: 'Nails', id: 'nails' },
        { name: 'Washers', id: 'washers' },
        { name: 'Nuts', id: 'nuts' },
        { name: 'Mangos', id: 'mango'}
    ]
    // Add more lists as needed
};

function populateItems(list) {
    const itemsDiv = document.getElementById('items');
    itemsDiv.innerHTML = '';
    list.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');
        itemDiv.setAttribute('data-name', item.name.toLowerCase());
        itemDiv.innerHTML = `
            <span>${item.name}</span>
            <button onclick="decrement('${item.id}')">-</button>
            <input type="number" id="${item.id}" value="0" min="0" oninput="validateInput('${item.id}')">
            <button onclick="increment('${item.id}')">+</button>
        `;
        itemsDiv.appendChild(itemDiv);
    });
}

function changeList() {
    const selectedList = document.getElementById('list-selector').value;
    populateItems(itemsList[selectedList]);
}

// Call this to populate initial items when the page loads
document.addEventListener('DOMContentLoaded', () => {
    populateItems(itemsList.list1); 
});

function increment(id) { // Call for increasing the order count
    let element = document.getElementById(id); // Element calls the id of the element, so if screws then it will take screws and add it
    let value = parseInt(element.value); // Take the value (number of items needed) so when you send the email it knows how many you need
    element.value = value + 1; // Displays the counter for how many are there
}

function decrement(id) { // Decreasing order count, does the same thing as increment however it just goes down
    let element = document.getElementById(id);
    let value = parseInt(element.value);
    if (value > 0) {
        element.value = value - 1;
    }
}

function validateInput(id) { // Ensures input is not below 0
    let element = document.getElementById(id);
    if (element.value < 0) {
        element.value = 0;
    }
}

function filterItems() { // Filter function for the search bar
    let search = document.getElementById('search').value.toLowerCase(); // Takes what is in the search bar and turns it to lowercase
    let items = document.querySelectorAll('.item'); // Filters through all the items that are possible selection

    items.forEach(item => { // Goes through all the data names (what you have each item listed as)
        let name = item.getAttribute('data-name').toLowerCase();
        if (name.includes(search)) { // If what is in the search bar is in data name, then it will be displayed
            item.style.display = '';
        } else { // If not then there will be no display
            item.style.display = 'none';
        }
    });
}

function completeOrder() {
    let emailsInput = document.getElementById('emails'); // Takes the emails
    let emails = emailsInput.value.split(';').map(email => email.trim()); // Trims them to get rid of white space and you are left with email;email;email
    let subjectInput = document.getElementById('Kitbox');
    let subject = 'Kitbox Order number: ' + subjectInput.value;
    if (emails.length === 0 || emails[0] === "") { // If none then you cannot proceed
        alert("Please enter at least one email address.");
        return;
    }

    let items = document.querySelectorAll('.item'); // .querySelectorAll() is used to collect a list of all the .items (things we want to order)
    let order = []; // The list for what we will order

    items.forEach(item => { // Go through each item
        let name = item.getAttribute('data-name'); // Get the data name
        let value = parseInt(item.querySelector('input[type="number"]').value); // Get the value from the input field
        if (value > 0) {
            order.push(`${value} ${name}`); // Add the value and the name to the list
        }
    });

    if (order.length === 0) { // If empty we can't do anything
        alert("No items selected.");
        return;
    }

    let orderText = `Hey, we need ${order.join(', ')}.`; // What we are sending out
    sendEmails(emails, orderText, subject); // Call send email
}

function sendEmails(emails, orderText, subject) {
    let emailBody = `${orderText}\n\n- Sent from my Order Form`; // This is what is being sent
    let recipients = emails.join(';'); // Adds to the email recipients by semicolon
    // mailto is used to generate an email link that can open the user's default email
    // orderbody is just sending over the email body that is above
    let emailLink = `mailto:${recipients}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = emailLink; // This line opens the email link on your computer with the default email you use
    setTimeout(() => {
        window.location.href = emailLink; // This ensures the link is opened properly even if there's a slight delay
    }, 500);
}

function clearAll() { // Clear all function
    let items = document.querySelectorAll('.item');
    items.forEach(item => { // Goes through each item
        item.querySelector('input[type="number"]').value = '0'; // Clears the input value and also sets the visual to 0
    });
}
