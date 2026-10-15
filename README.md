# RackRight Warehousing: Warehouse Management Service

ITBT Live Class Exercise: Build a Digital Business App.

**Student:** Syed Moazzam Zafar | **GitHub:** SyedMoazzam7

**Live site:** https://syedmoazzam7.github.io/Syed.Zafar-BusinessApp/

## Business
RackRight Warehousing is a multi-client warehouse in Navi Mumbai that stores, picks, packs and dispatches stock for small and mid-size businesses.

## Problem
Small sellers cannot see their stock, orders and dispatch status in real time. They find out about stock-outs and late dispatches only after customers complain.

## Customer
E-commerce sellers, D2C brands, small manufacturers and distributors shipping 100 to 5,000 orders a month.

## Solution
A web app with a manager dashboard and an order-tracking tool.

## Sections (5 required, 6 built)
1. **Home**: business name, logo, purpose, short description, "Get Started" button
2. **About Business**: what we do, target customers, service area, value proposition
3. **Services**: table of 6 services with descriptions and prices in ₹
4. **Dashboard**: 6 KPIs, 2 charts (weekly orders bar chart, zone utilisation bar chart), stock-out table
5. **Track Order**: the interactive business feature
6. **Contact / Enquiry**: email, phone, location, enquiry button

## Interactive business feature
**Track an order.** Enter an Order ID (for example `TRK1025`) and the app shows status, current location, expected delivery, courier partner and a progress bar. Sample IDs: `TRK1021` to `TRK1030`. `TRK1027` and `TRK1030` show delayed orders with a reason.

## Hyperlinks and their business purpose
| Link | Purpose |
|---|---|
| Navigation bar (Home, About, Services, Dashboard, Track order, Contact) | Move between sections |
| Home "Get Started" to Services | Send new visitors to pricing |
| Services "Request quote" to Contact | Turn pricing interest into an enquiry (pre-fills the service name) |
| Dashboard to Track order | Check which customers are affected by stock-outs and delays |
| Track result "Contact the warehouse" to Contact | Help customers with order questions |
| Email (`mailto:`) | Send an enquiry |
| Phone (`tel:`) | Call the warehouse |
| Google Maps | Directions to the facility |
| LinkedIn | Company profile and credibility |
| WDRA (wdra.gov.in) | Warehouse registration and e-warehouse receipt rules |
| Central Warehousing Corporation (cewacor.nic.in) | Public-sector warehousing benchmarks |

## Dashboard: what the manager needs to know immediately
Inventory on hand, orders received, orders dispatched, pending orders, stock-out items and warehouse utilisation. All figures are sample data and can be edited at the top of `script.js`.

## Files
```
index.html     page structure and content
style.css      design and responsive layout
script.js      dashboard, charts, order tracking
images/        logo.svg, warehouse-racks.svg
README.md      this file
```

## Publish on GitHub Pages
1. Create a public repository named `Syed.Zafar-BusinessApp` under the GitHub account `SyedMoazzam7`.
2. Upload all files and the `images` folder.
3. Go to **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then **Save**.
4. After a minute, your link appears at the top of the Pages screen. Submit that link.

## 2-minute presentation answers
1. **What is your business?** RackRight Warehousing, a warehouse management service.
2. **What problem are you solving?** Sellers cannot see stock, orders and delays in real time.
3. **Who is your customer?** Small e-commerce sellers, D2C brands and distributors.
4. **What does your app do?** Shows services and prices, lets customers track an order by ID, and takes enquiries.
5. **What does your dashboard tell the manager?** Inventory, orders received and dispatched, pending orders, stock-outs and space utilisation.
