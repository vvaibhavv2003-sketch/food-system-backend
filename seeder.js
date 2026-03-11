const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const FoodItem = require('./models/FoodItem');
const Category = require('./models/Category');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

connectDB();




const categories = [
    'Pizza', 'Burger', 'Sandwich', 'Maggi', 'Dabeli', 'Puff', 'Samosa'
];

const foodData = [
    // --- PIZZAS (10 Items) ---
    {
        name: "Margherita Classic",
        category: "Pizza",
        price: 249,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500",
        description: "Classic delight with 100% real mozzarella cheese.",
        rating: 4.5,
        deliveryTime: "25-30 min",
        isVeg: true,
        votes: 520
    },
    {
        name: "Farmhouse Pizza",
        category: "Pizza",
        price: 399,
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500",
        description: "Delightful combination of onion, capsicum, tomato & grilled mushroom.",
        rating: 4.7,
        deliveryTime: "30-40 min",
        isVeg: true,
        votes: 850
    },
    {
        name: "Peppy Paneer",
        category: "Pizza",
        price: 359,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Flavorful trio of juicy paneer, crisp capsicum with spicy red paprika.",
        rating: 4.8,
        deliveryTime: "30-35 min",
        isVeg: true,
        votes: 1200
    },
    {
        name: "Chicken Dominator",
        category: "Pizza",
        price: 549,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500",
        description: "Loaded with double pepper barbecue chicken, peri-peri chicken, chicken tikka & grilled chicken rasher.",
        rating: 4.9,
        deliveryTime: "35-45 min",
        isVeg: false,
        votes: 2100
    },
    {
        name: "Veggie Paradise",
        category: "Pizza",
        price: 329,
        image: "https://images.unsplash.com/photo-1593560708920-63984dc77432?w=500",
        description: "Goldern corn, black olives, capsicum & red paprika.",
        rating: 4.4,
        deliveryTime: "25-35 min",
        isVeg: true,
        votes: 450
    },
    {
        name: "Pepperoni Feast",
        category: "Pizza",
        price: 599,
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500",
        description: "American classic! Spicy, herbed pepperoni on a bed of cheese.",
        rating: 4.8,
        deliveryTime: "30-40 min",
        isVeg: false,
        votes: 1800
    },
    {
        name: "Paneer Makhani Pizza",
        category: "Pizza",
        price: 419,
        image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=500",
        description: "Paneer chunks in spicy makhani sauce with capsicum.",
        rating: 4.6,
        deliveryTime: "30-40 min",
        isVeg: true,
        votes: 920
    },
    {
        name: "Mexican Green Wave",
        category: "Pizza",
        price: 379,
        image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=500",
        description: "A pizza loaded with crunchy onions, crisp capsicum, juicy tomatoes and jalapeno.",
        rating: 4.5,
        deliveryTime: "30-40 min",
        isVeg: true,
        votes: 700
    },
    {
        name: "Double Cheese Margherita",
        category: "Pizza",
        price: 299,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60",
        description: "Loaded with extra cheese for cheese lovers.",
        rating: 4.7,
        deliveryTime: "30-35 min",
        isVeg: true,
        votes: 890
    },
    {
        name: "Spicy Chicken Pizza",
        category: "Pizza",
        price: 449,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60",
        description: "Hot and spicy chicken topped with red paprika.",
        rating: 4.5,
        deliveryTime: "35-40 min",
        isVeg: false,
        votes: 650
    },

    // --- BURGERS (10 Items) ---
    {
        name: "Crispy Veg Burger",
        category: "Burger",
        price: 89,
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500",
        description: "Crispy fried patty with fresh lettuce and mayo.",
        rating: 4.2,
        deliveryTime: "20-25 min",
        isVeg: true,
        votes: 1500
    },
    {
        name: "Maharaja Mac",
        category: "Burger",
        price: 219,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
        description: "Tall and tasty double patty burger with rich sauces.",
        rating: 4.7,
        deliveryTime: "25-35 min",
        isVeg: true,
        votes: 3200
    },
    {
        name: "Chicken Whopper",
        category: "Burger",
        price: 199,
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500",
        description: "Flame grilled chicken patty with signature veggies.",
        rating: 4.6,
        deliveryTime: "25-30 min",
        isVeg: false,
        votes: 2800
    },
    {
        name: "Spicy Paneer Burger",
        category: "Burger",
        price: 159,
        image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=500",
        description: "Spicy paneer patty with schezwan sauce.",
        rating: 4.4,
        deliveryTime: "20-30 min",
        isVeg: true,
        votes: 950
    },
    {
        name: "Crispy Chicken Burger",
        category: "Burger",
        price: 139,
        image: "https://images.unsplash.com/photo-1615297349706-e02798d48a2b?w=500",
        description: "Fried chicken patty with lettuce and cheese.",
        rating: 4.5,
        deliveryTime: "25-30 min",
        isVeg: false,
        votes: 1100
    },
    {
        name: "Ultimate Cheeseburger",
        category: "Burger",
        price: 249,
        image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500",
        description: "Overloaded with cheese layers and juicy patty.",
        rating: 4.8,
        deliveryTime: "25-35 min",
        isVeg: false,
        votes: 1600
    },
    {
        name: "Aloo Tikki Burger",
        category: "Burger",
        price: 59,
        image: "https://images.unsplash.com/photo-1628543540250-98317a22cc13?w=500",
        description: "Indian style potato patty burger with tangy sauce.",
        rating: 4.1,
        deliveryTime: "15-20 min",
        isVeg: true,
        votes: 5000
    },
    {
        name: "Veggie Supreme Burger",
        category: "Burger",
        price: 109,
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=60",
        description: "Loaded with veggies and extra cheese.",
        rating: 4.3,
        deliveryTime: "20-25 min",
        isVeg: true,
        votes: 800
    },
    {
        name: "Tandoori Chicken Burger",
        category: "Burger",
        price: 179,
        image: "https://images.unsplash.com/photo-1615297349706-e02798d48a2b?w=500&auto=format&fit=crop&q=60",
        description: "Chicken patty marinated in tandoori spices.",
        rating: 4.6,
        deliveryTime: "25-30 min",
        isVeg: false,
        votes: 1200
    },
    {
        name: "Paneer King Burger",
        category: "Burger",
        price: 149,
        image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=500&auto=format&fit=crop&q=60",
        description: "Double paneer patty with spicy sauce.",
        rating: 4.5,
        deliveryTime: "20-25 min",
        isVeg: true,
        votes: 980
    },

    // --- SANDWICH (10 Items) ---
    {
        name: "Bombay Masala Sandwich",
        category: "Sandwich",
        price: 120,
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500",
        description: "Spicy potato filling with sev and chutney in grilled bread.",
        rating: 4.5,
        deliveryTime: "20-25 min",
        isVeg: true,
        votes: 2500
    },
    {
        name: "Paneer Grill Sandwich",
        category: "Sandwich",
        price: 140,
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500",
        description: "Loaded with spiced paneer and veggies, grilled to perfection.",
        rating: 4.6,
        deliveryTime: "20-30 min",
        isVeg: true,
        votes: 1300
    },
    {
        name: "Chicken Club Sandwich",
        category: "Sandwich",
        price: 160,
        image: "https://images.unsplash.com/photo-1553909489-cd47e3b4430f?w=500",
        description: "Three layers of chicken, egg, cheese and veggies.",
        rating: 4.7,
        deliveryTime: "25-35 min",
        isVeg: false,
        votes: 1600
    },
    {
        name: "Cheese Meltdown Sandwich",
        category: "Sandwich",
        price: 130,
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500",
        description: "Overflowing with mozzarella and cheddar cheese.",
        rating: 4.4,
        deliveryTime: "20-25 min",
        isVeg: true,
        votes: 1000
    },
    {
        name: "Veg Grilled Sandwich",
        category: "Sandwich",
        price: 90,
        image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Classic grilled sandwich with cucumber, tomato and potato.",
        rating: 4.2,
        deliveryTime: "15-20 min",
        isVeg: true,
        votes: 800
    },
    {
        name: "Corn & Cheese Sandwich",
        category: "Sandwich",
        price: 110,
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Sweet corn mixed with mayo and cheese grilled.",
        rating: 4.4,
        deliveryTime: "20-25 min",
        isVeg: true,
        votes: 950
    },
    {
        name: "Aloo Matar Sandwich",
        category: "Sandwich",
        price: 80,
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Spiced potato and peas filling toasted.",
        rating: 4.1,
        deliveryTime: "15-20 min",
        isVeg: true,
        votes: 600
    },
    {
        name: "Tandoori Paneer Sandwich",
        category: "Sandwich",
        price: 150,
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Paneer marinated in tandoori sauce grilled in bread.",
        rating: 4.7,
        deliveryTime: "20-30 min",
        isVeg: true,
        votes: 1200
    },
    {
        name: "Chocolate Sandwich",
        category: "Sandwich",
        price: 100,
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Sweet treat with melted chocolate and nuts.",
        rating: 4.6,
        deliveryTime: "15-20 min",
        isVeg: true,
        votes: 1800
    },
    {
        name: "Mayonnaise Sandwich",
        category: "Sandwich",
        price: 85,
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Simple yet tasty vegetable and mayo sandwich.",
        rating: 4.2,
        deliveryTime: "15-20 min",
        isVeg: true,
        votes: 750
    },

    // --- MAGGI (10 Items) ---
    {
        name: "Classic Masala Maggi",
        category: "Maggi",
        price: 50,
        image: "/images/maggi.png",
        description: "Everyone's favorite 2-minute noodle bowl.",
        rating: 4.8,
        deliveryTime: "10-15 min",
        isVeg: true,
        votes: 5000
    },
    {
        name: "Vegetable Maggi",
        category: "Maggi",
        price: 70,
        image: "/images/vegetable_maggi.png",
        description: "Loaded with fresh peas, carrots and beans.",
        rating: 4.6,
        deliveryTime: "15-20 min",
        isVeg: true,
        votes: 3200
    },
    {
        name: "Cheese Butter Maggi",
        category: "Maggi",
        price: 90,
        image: "/images/cheese_butter_maggi.png",
        description: "Rich and creamy buttery maggi topped with cheese.",
        rating: 4.9,
        deliveryTime: "15-20 min",
        isVeg: true,
        votes: 4100
    },
    {
        name: "Schezwan Maggi",
        category: "Maggi",
        price: 80,
        image: "/images/schezwan_maggi.png",
        description: "Spicy schezwan sauce twist to classic maggi.",
        rating: 4.7,
        deliveryTime: "15-20 min",
        isVeg: true,
        votes: 2500
    },
    {
        name: "Egg Maggi",
        category: "Maggi",
        price: 80,
        image: "/images/egg_maggi.png",
        description: "Maggi scrambled with eggs and spices.",
        rating: 4.5,
        deliveryTime: "15-20 min",
        isVeg: false,
        votes: 1800
    },
    {
        name: "Chicken Maggi",
        category: "Maggi",
        price: 110,
        image: "/images/chicken_maggi.png",
        description: "Maggi with juicy chicken chunks.",
        rating: 4.6,
        deliveryTime: "20-25 min",
        isVeg: false,
        votes: 2100
    },
    {
        name: "Paneer Maggi",
        category: "Maggi",
        price: 100,
        image: "/images/paneer_maggi.png",
        description: "Topped with fried paneer cubes.",
        rating: 4.7,
        deliveryTime: "15-20 min",
        isVeg: true,
        votes: 1500
    },
    {
        name: "Garlic Maggi",
        category: "Maggi",
        price: 75,
        image: "/images/garlic_maggi.png",
        description: "Strong garlic flavor for garlic lovers.",
        rating: 4.4,
        deliveryTime: "15-20 min",
        isVeg: true,
        votes: 900
    },
    {
        name: "Soupy Maggi",
        category: "Maggi",
        price: 60,
        image: "/images/soupy_maggi.png",
        description: "Extra soupy noodles, perfect for rainy days.",
        rating: 4.5,
        deliveryTime: "15-20 min",
        isVeg: true,
        votes: 1200
    },
    {
        name: "Peri Peri Maggi",
        category: "Maggi",
        price: 85,
        image: "/images/peri_peri_maggi.png",
        description: "Spicy peri peri masala dusted noodles.",
        rating: 4.6,
        deliveryTime: "15-20 min",
        isVeg: true,
        votes: 1400
    },

    // --- DABELI (10 Items) --
    {
        name: "Kutchi Dabeli",
        category: "Dabeli",
        price: 30,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        description: "Authentic sweet and spicy potato mix in bun.",
        rating: 4.8,
        deliveryTime: "10-15 min",
        isVeg: true,
        votes: 3500
    },
    {
        name: "Cheese Dabeli",
        category: "Dabeli",
        price: 50,
        image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500",
        description: "Loaded with grated processed cheese.",
        rating: 4.9,
        deliveryTime: "10-15 min",
        isVeg: true,
        votes: 2800
    },
    {
        name: "Butter Dabeli",
        category: "Dabeli",
        price: 40,
        image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500",
        description: "Roasted in pure butter.",
        rating: 4.7,
        deliveryTime: "10-15 min",
        isVeg: true,
        votes: 2100
    },
    {
        name: "Dry Fruit Dabeli",
        category: "Dabeli",
        price: 60,
        image: "https://images.unsplash.com/photo-1599307767316-77e3aa0e49ca?w=500",
        description: "Rich potato mix stuffed with cashews and raisins.",
        rating: 4.6,
        deliveryTime: "10-15 min",
        isVeg: true,
        votes: 1200
    },
    {
        name: "Schezwan Dabeli",
        category: "Dabeli",
        price: 45,
        image: "https://images.unsplash.com/photo-1628543540250-98317a22cc13?w=500",
        description: "Spicy twist with schezwan chutney.",
        rating: 4.5,
        deliveryTime: "10-15 min",
        isVeg: true,
        votes: 900
    },
    {
        name: "Masala Dabeli",
        category: "Dabeli",
        price: 35,
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500",
        description: "Extra spicy masala dabeli.",
        rating: 4.4,
        deliveryTime: "10-15 min",
        isVeg: true,
        votes: 800
    },
    {
        name: "Jain Dabeli",
        category: "Dabeli",
        price: 35,
        image: "https://images.unsplash.com/photo-1546833999-b9f581602809?w=500",
        description: "No onion, no garlic dabeli.",
        rating: 4.5,
        deliveryTime: "10-15 min",
        isVeg: true,
        votes: 1500
    },
    {
        name: "Sing Dabeli",
        category: "Dabeli",
        price: 30,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500",
        description: "Simple dabeli with extra peanuts.",
        rating: 4.3,
        deliveryTime: "10-15 min",
        isVeg: true,
        votes: 600
    },
    {
        name: "Double Cheese Dabeli",
        category: "Dabeli",
        price: 65,
        image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500",
        description: "Cheese inside and outside.",
        rating: 4.9,
        deliveryTime: "10-15 min",
        isVeg: true,
        votes: 1900
    },
    {
        name: "Toast Dabeli",
        category: "Dabeli",
        price: 40,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
        description: "Crispy grilled dabeli.",
        rating: 4.6,
        deliveryTime: "10-15 min",
        isVeg: true,
        votes: 1100
    },

    // --- PUFF (10 Items) ---
    {
        name: "Veg Puff",
        category: "Puff",
        price: 25,
        image: "/images/puff.png",
        description: "Flaky pastry filled with spiced mixed vegetables.",
        rating: 4.5,
        deliveryTime: "10-15 min",
        isVeg: true,
        votes: 2200
    },
    {
        name: "Paneer Puff",
        category: "Puff",
        price: 40,
        image: "/images/paneer_puff.png",
        description: "Puff pastry stuffed with paneer chilli mix.",
        rating: 4.7,
        deliveryTime: "10-15 min",
        isVeg: true,
        votes: 1800
    },
    {
        name: "Cheese Puff",
        category: "Puff",
        price: 45,
        image: "/images/paneer_puff.png",
        description: "Melty cheese inside crispy layers.",
        rating: 4.8,
        deliveryTime: "10-15 min",
        isVeg: true,
        votes: 1500
    },
    {
        name: "Chinese Puff",
        category: "Puff",
        price: 35,
        image: "/images/puff.png",
        description: "Noodles and manchurian filling puff.",
        rating: 4.6,
        deliveryTime: "10-15 min",
        isVeg: true,
        votes: 1100
    },
    {
        name: "Aloo Puff",
        category: "Puff",
        price: 20,
        image: "/images/puff.png",
        description: "Classic simple potato puff.",
        rating: 4.3,
        deliveryTime: "10-15 min",
        isVeg: true,
        votes: 3000
    },
    {
        name: "Pizza Puff",
        category: "Puff",
        price: 50,
        image: "/images/paneer_puff.png",
        description: "Pizza sauce, cheese and veggies inside.",
        rating: 4.9,
        deliveryTime: "15-20 min",
        isVeg: true,
        votes: 2100
    },
    {
        name: "Egg Puff",
        category: "Puff",
        price: 35,
        image: "/images/puff.png",
        description: "Spicy boiled egg masala filling.",
        rating: 4.6,
        deliveryTime: "10-15 min",
        isVeg: false,
        votes: 1300
    },
    {
        name: "Chicken Puff",
        category: "Puff",
        price: 60,
        image: "/images/puff.png",
        description: "Minced chicken masala puff.",
        rating: 4.8,
        deliveryTime: "15-20 min",
        isVeg: false,
        votes: 2500
    },
    {
        name: "Masala Puff",
        category: "Puff",
        price: 25,
        image: "/images/puff.png",
        description: "Spicy dry masala filling.",
        rating: 4.4,
        deliveryTime: "10-15 min",
        isVeg: true,
        votes: 900
    },
    {
        name: "Jain Puff",
        category: "Puff",
        price: 30,
        image: "/images/puff.png",
        description: "Raw banana filling for Jain diet.",
        rating: 4.5,
        deliveryTime: "10-15 min",
        isVeg: true,
        votes: 700
    },

    // --- SAMOSA (5 Items) ---
    {
        name: "Classic Punjabi Samosa",
        category: "Samosa",
        price: 20,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        description: "Crispy pastry filled with spiced potatoes and peas.",
        rating: 4.8,
        deliveryTime: "10-15 min",
        isVeg: true,
        votes: 4500
    },
    {
        name: "Cheese Corn Samosa",
        category: "Samosa",
        price: 35,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500",
        description: "Melty cheese and sweet corn filling.",
        rating: 4.7,
        deliveryTime: "10-15 min",
        isVeg: true,
        votes: 3200
    },
    {
        name: "Paneer Samosa",
        category: "Samosa",
        price: 30,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500",
        description: "Rich paneer stuffing in crispy samosa.",
        rating: 4.6,
        deliveryTime: "10-15 min",
        isVeg: true,
        votes: 2800
    },
    {
        name: "Chinese Samosa",
        category: "Samosa",
        price: 25,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500",
        description: "Spicy noodles and veggie filling.",
        rating: 4.5,
        deliveryTime: "10-15 min",
        isVeg: true,
        votes: 2100
    },
    {
        name: "Mini Dry Samosa",
        category: "Samosa",
        price: 15,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500",
        description: "Tiny crispy samosa with dry spice filling.",
        rating: 4.4,
        deliveryTime: "5-10 min",
        isVeg: true,
        votes: 1500
    }
];

const categoryData = [
    { name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80' },
    { name: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80' },
    { name: 'Sandwich', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80' },
    { name: 'Maggi', image: '/images/vegetable_maggi.png' },
    { name: 'Dabeli', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { name: 'Puff', image: '/images/paneer_puff.png' },
    { name: 'Samosa', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' }
];

const seedDB = async () => {
    try {
        await FoodItem.deleteMany();
        await Category.deleteMany();
        console.log('Existing items and categories removed');

        const itemsWithIds = foodData.map((item, index) => ({
            ...item,
            id: index + 1 // Generate simple IDs
        }));

        await FoodItem.insertMany(itemsWithIds);
        await Category.insertMany(categoryData);

        // --- Create Default Admin User ---
        const adminEmail = 'admin@toastybites.com';
        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await User.create({
                name: 'Super Admin',
                email: adminEmail,
                mobile: '9999999999',
                password: hashedPassword,
                role: 'admin',
                isVerified: true
            });
            console.log('Default Admin User Created');
        } else {
            console.log('Admin user already exists');
        }

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedDB();
