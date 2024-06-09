const itemsData = {
    list1: [
        { name: 'Copper Cables', id: 'copper-cables' },
        { name: 'Bolt', id: 'bolt' },
        { name: 'Screws', id: 'screws' }
        // Add more items for list1
    ],
    list2: [
        { name: 'Nuts', id: 'nuts' },
        { name: 'Washers', id: 'washers' },
        { name: 'Rivets', id: 'rivets' }
        // Add more items for list2
    ]
    // Add more lists if needed
};

function changeList() {
    const listSelector = document.getElementById('list-selector');
    const selectedList = listSelector.value;
    const itemsDiv = document.getElementById('items');

    itemsDiv.innerHTML = '';

    itemsData[selectedList].forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
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

function increment(id) {
    const input = document.getElementById(id);
    input.value = parseInt(input.value) + 1;
}

function decrement(id) {
    const input = document.getElementById(id);
    if (input.value > 0) {
        input.value = parseInt(input.value) - 1;
    }
}

function validateInput(id) {
    const input = document.getElementById(id);
    if (input.value < 0) {
        input.value = 0;
    }
}

function filterItems() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const items = document.querySelectorAll('#items .item');

    items.forEach(item => {
        const itemName = item.getAttribute('data-name');
        if (itemName.includes(searchInput)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function clearAll() {
    const inputs = document.querySelectorAll('#items input[type="number"]');
    inputs.forEach(input => {
        input.value = 0;
    });
}

function completeOrder() {
    const emails = document.getElementById('emails').value;
    const kitbox = document.getElementById('Kitbox').value;

    if (!emails || !kitbox) {
        alert('Please enter email addresses and Kit Box number.');
        return;
    }

    const items = document.querySelectorAll('#items .item');
    const order = [];

    items.forEach(item => {
        const itemName = item.querySelector('span').textContent;
        const quantity = item.querySelector('input[type="number"]').value;

        if (quantity > 0) {
            order.push({ item: itemName, quantity });
        }
    });

    if (order.length === 0) {
        alert('Please select at least one item.');
        return;
    }

    const emailList = emails.split(';').map(email => email.trim()).filter(email => email);
    const subject = `Order for Kit Box ${kitbox}`;
    const body = `Order Details:\n\n${order.map(item => `${item.item}: ${item.quantity}`).join('\n')}`;

    emailList.forEach(email => {
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });

    alert('Order email(s) sent successfully.');
}
