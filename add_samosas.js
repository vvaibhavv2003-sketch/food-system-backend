
const http = require('http');

const samosas = [
    {
        name: "Classic Samosa",
        category: "Samosa",
        price: 20,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=60",
        description: "Crispy pastry filled with spiced potatoes and peas.",
        isVeg: true,
        rating: 4.8,
        deliveryTime: "15-20 min"
    },
    {
        name: "Punjabi Samosa",
        category: "Samosa",
        price: 30,
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=60",
        description: "Authentic big Punjabi samosa with rich spices.",
        isVeg: true,
        rating: 4.9,
        deliveryTime: "20-25 min"
    },
    {
        name: "Cheese Corn Samosa",
        category: "Samosa",
        price: 45,
        image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=500&q=60",
        description: "Fusion samosa filled with gooey cheese and sweet corn.",
        isVeg: true,
        rating: 4.7,
        deliveryTime: "20 min"
    },
    {
        name: "Paneer Samosa",
        category: "Samosa",
        price: 50,
        image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=500&q=60",
        description: "Delicious filling of spicy paneer bhurji.",
        isVeg: true,
        rating: 4.6,
        deliveryTime: "20 min"
    },
    {
        name: "Mini Cocktail Samosa",
        category: "Samosa",
        price: 150,
        image: "https://media.istockphoto.com/id/502663991/photo/punjabi-samosa-23.jpg?s=612x612&w=0&k=20&c=Ne0ArOESNq5_lqV5r4u5b8y-0rC9-4jW-6Jc-1t-1jM=",
        description: "Bucket of 10 mini crisp samosas, perfect for snacks.",
        isVeg: true,
        rating: 4.5,
        deliveryTime: "15 min"
    }
];

const postItem = (item) => {
    const data = JSON.stringify(item);
    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/foods',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = http.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            console.log(`Added ${item.name}: Status ${res.statusCode}`);
        });
    });

    req.on('error', (e) => {
        console.error(`Problem adding ${item.name}: ${e.message}`);
    });

    req.write(data);
    req.end();
};

samosas.forEach((item, index) => {
    setTimeout(() => {
        postItem(item);
    }, index * 500); // Stagger requests slightly
});
