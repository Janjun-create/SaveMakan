Build a complete responsive web application prototype called “SaveMakan”, a campus-focused surplus food rescue and food waste management platform.

SaveMakan is a real startup concept, not just a visual mockup. The prototype should demonstrate a realistic end-to-end product ecosystem with separate user roles, clear system states, realistic interactions, and a polished startup-quality interface.

The main objective is to reduce food waste within university campuses by connecting food vendors with students through discounted surplus food, while recording unsold food data and supporting sustainable organic waste management.

PRIMARY TAGLINE:
“Rescue Food. Save Money. Build a Sustainable Campus.”

BRAND DIRECTION:
Use a modern, trustworthy, premium sustainability-tech design.
Use deep green, fresh green, warm cream, white, and dark charcoal as the main colour palette.
Use clean modern typography, rounded cards, clear icons, subtle shadows, spacious layouts, and professional data visualisations.
The design should look like a real startup product suitable for a national innovation competition, university stakeholders, vendors, students, and potential investors.
Do not make it look childish, overly decorative, or like a generic school project.

==================================================
USER ROLES
==========

Create role-based experiences for:

1. STUDENT
2. FOOD VENDOR
3. ADMIN / UNIVERSITY
4. ORGANIC WASTE / COMPOST PARTNER

Each role must have a separate dashboard and appropriate permissions.

Students must not be able to edit vendor listings.
Vendors must only be able to manage their own listings and orders.
Admins can monitor and manage the overall campus ecosystem.
Compost partners can only access assigned organic waste collection records.

==================================================
STUDENT EXPERIENCE
==================

Create these student screens:

1. Student Login / Registration

* Email login
* Password
* University email verification
* Clear role selection or role-based account access
* Clean and simple authentication UI

2. Student Home Dashboard
   Show:

* Available discounted food near campus
* Food categories
* Search
* Filters:

  * Price
  * Distance/location
  * Pickup time
  * Food type
  * Availability
* “Ending Soon” section
* “Popular Deals” section
* “Almost Sold Out” indicator

3. Food Listing Card
   Each card should display:

* Actual food image
* Food name
* Original price
* Discounted price
* Discount percentage
* Quantity remaining
* Vendor name
* Pickup location
* Prepared time
* Vendor-recommended consumption time
* Vendor rating
* Verified vendor badge
* Food status

4. Food Details Page
   Show:

* Actual food photo
* Food name
* Original price
* Discounted price
* Quantity available
* Vendor information
* Pickup location
* Preparation time
* Recommended consumption information provided by the vendor
* Vendor rating
* Food information
* “Reserve / Buy Now” button

Include a clear notice that food information is provided by the vendor and that the vendor remains responsible for food handling and food safety decisions.

5. Reservation and Checkout Flow
   When a student selects an item:

* Temporarily hold the selected quantity
* Show a countdown payment timer
* Example: “Reserved for you — complete payment within 5 minutes”
* Prevent the same inventory from being sold to multiple students
* The server/database must be treated as the single source of truth for inventory

For example:
If only 1 meal is available and 10 students attempt to reserve it simultaneously:

* Only one valid request can successfully claim the item
* Other users receive: “This item has just been reserved by another student”
* If the successful student does not complete payment before the timer expires, the item becomes available again

Do not allow inventory to become negative.

6. Payment Screen
   Create a realistic payment interface with:

* Order summary
* Discounted price
* Payment status
* Payment processing state
* Payment success state
* Payment failure state
* Retry payment option

The prototype may simulate payment for demonstration purposes.
Do not store card details inside SaveMakan.
Payment information should be handled by a payment gateway in a real production implementation.

7. Order Confirmation
   After successful payment:

* Show successful payment confirmation
* Generate a unique QR code for pickup
* Show order ID
* Show pickup location
* Show pickup deadline
* Show order status

8. QR Pickup Screen
   The student displays a QR code to the vendor.

The QR code must have states:

* Valid
* Already used
* Expired
* Invalid

Once the vendor successfully scans the QR code:

* Order status changes to PICKED UP / COMPLETED
* Quantity is reduced
* Meals Rescued count increases
* Impact analytics update

A QR code must not be reusable.

9. Order History
   Show:

* Active orders
* Completed orders
* Expired orders
* Cancelled orders
* Order details

10. Review and Report
    Students can review a vendor only after a completed purchase.
    Students can report:

* Incorrect food information
* Order issue
* Pickup issue
* Other concern

==================================================
VENDOR EXPERIENCE
=================

Create these vendor screens:

1. Vendor Login / Registration

* Vendor account authentication
* Verification status
* Vendor profile

2. Vendor Dashboard
   Show:

* Today's sales
* Active listings
* Meals rescued
* Unsold food
* Food waste recorded
* Student savings generated
* Recent orders
* Quick actions

Quick action buttons:

* Add Surplus Food
* Manage Listings
* View Orders
* Scan QR
* Record Unsold Food
* View Analytics

3. Add Surplus Food
   The vendor can enter:

* Food name
* Actual food image
* Quantity
* Original price
* Discounted price
* Preparation time
* Vendor-recommended consumption time
* Pickup location
* Availability start time
* Availability end time
* Food description

Include vendor confirmation checkboxes:

* Food was prepared today
* Information provided is accurate
* Packaging information is accurate
* Vendor is responsible for food handling and food safety decisions

4. Listing Management
   The vendor can:

* Create listing
* Edit listing
* Update quantity
* Update price
* Update availability time
* Mark as sold out
* End listing

Vendors are allowed to edit their listings because they understand their own food operations.

However, important changes must be recorded in an audit history:

* What was changed
* Previous value
* New value
* Who changed it
* Date and time

5. Vendor Order Management
   Show:

* Pending payment
* Paid
* Ready for pickup
* Picked up
* Expired
* Cancelled

6. QR Scanner
   Create a vendor QR scanner interface.

When scanning:

* Valid QR → confirm pickup
* Already used → show error
* Expired → show error
* Invalid → show error

Successful pickup updates:

* Order status
* Inventory
* Meals rescued
* Impact dashboard

7. Unsold Food Recording
   When the listing availability period ends, the system checks whether quantity remains.

If quantity = 0:

* Status = SOLD OUT / COMPLETED

If quantity > 0:

* Status = UNSOLD
* Vendor must record remaining quantity

Ask:
“What happened to the remaining food?”

Reasons:

* Low demand
* Overproduction
* Event cancellation
* Late listing
* Other

Then ask:
“Is the remaining food still suitable for consumption?”

If YES:

* Relist
* Donate
* Other recovery option

If NO:

* Record as organic food waste

The system must not automatically decide whether food is safe to eat.
The vendor is responsible for evaluating the food based on appropriate food safety practices.

8. Waste Record
   Vendor enters:

* Food type
* Estimated weight
* Quantity
* Reason
* Date
* Optional notes

9. Organic Waste Collection
   Create a flow:

WASTE RECORDED
→ AWAITING COLLECTION
→ COLLECTION REQUESTED
→ ACCEPTED BY COMPOST PARTNER
→ COLLECTED
→ PROCESSED
→ RECYCLED

==================================================
ADMIN / UNIVERSITY DASHBOARD
============================

Create an admin dashboard showing the campus-wide ecosystem.

Display:

* Total vendors
* Active food listings
* Total transactions
* Meals rescued
* Student savings
* Unsold food
* Food waste recorded
* Organic waste diverted
* Waste collection status
* Sustainability impact

Create analytics:

* Food rescued over time
* Food waste trends
* Most common reasons for unsold food
* Vendor performance
* Food demand patterns
* Total student savings
* Organic waste recycling progress

Admin functions:

* Verify vendors
* Suspend vendors
* Review complaints
* Monitor transactions
* Manage compost partners
* View audit logs
* Generate sustainability reports

==================================================
COMPOST / ORGANIC WASTE PARTNER EXPERIENCE
==========================================

Create a simple dashboard for an approved compost or organic waste partner.

Show:

* Collection requests
* Location
* Estimated waste weight
* Food waste type
* Pickup schedule
* Collection status

Actions:

* Accept request
* Schedule collection
* Mark as collected
* Mark as processed
* Mark as recycled

==================================================
FOOD AND ORDER STATE SYSTEM
===========================

The prototype must clearly demonstrate realistic status changes.

FOOD LISTING STATES:

DRAFT
→ ACTIVE
→ RESERVED
→ SOLD OUT
→ UNSOLD
→ RELISTED
→ WASTE RECORDED
→ RECYCLED

ORDER STATES:

AVAILABLE
→ HELD
→ PAYMENT PENDING
→ PAID
→ READY FOR PICKUP
→ PICKED UP
→ COMPLETED

Alternative paths:

PAYMENT PENDING
→ PAYMENT TIMEOUT
→ AVAILABLE AGAIN

PAID
→ CANCELLED
→ Refund / vendor policy flow

QR STATES:

VALID
→ SCANNED
→ USED

OR:

EXPIRED
INVALID
ALREADY USED

==================================================
CONCURRENT RESERVATION LOGIC
============================

Demonstrate this important scenario:

If 1 meal is available and 10 students try to reserve it simultaneously:

* The backend/server processes requests atomically
* Only one student successfully holds the inventory
* The other students receive a clear message that the item has just been reserved
* The successful student receives a limited payment window
* If payment times out, the inventory is released and becomes available again

Do not allow overselling.
Do not allow quantity to become negative.

==================================================
SECURITY AND PERMISSIONS
========================

Include realistic product security considerations:

* Role-based access control
* Students cannot access vendor management
* Vendors cannot edit another vendor’s listing
* Admin access is restricted
* Compost partners can only view assigned collection data
* Secure authentication
* Passwords must never be stored as plain text
* Payment details are not stored by SaveMakan
* QR codes are unique and non-reusable
* Audit logs record important changes
* User data should be protected
* Data backup should be considered
* Input validation should be used
* Users can report suspicious activity

==================================================
ANALYTICS AND FUTURE AI
=======================

Include a future development section.

AI should not be presented as deciding food safety.

Future AI features:

* Predict expected surplus food
* Analyse historical demand
* Recommend production quantities
* Suggest suitable discount levels
* Identify high-waste patterns
* Support vendor decision-making

Example future insight:
“Based on previous Friday data, this vendor may have 10–15 surplus meals between 6:00 PM and 8:00 PM.”

The AI provides insights.
The vendor remains responsible for operational and food safety decisions.

==================================================
IMPACT DASHBOARD
================

Create a visually attractive impact section showing simulated prototype data.

Clearly label the data as:
“Prototype Simulation Data”

Example metrics:

* 132 Meals Rescued
* RM428 Student Savings
* 58 kg Food Waste Recorded
* 32 kg Organic Waste Diverted

Use charts and cards for:

* Meals rescued
* Student savings
* Food waste reduction
* Organic waste diversion
* Vendor participation
* Food rescue trends

==================================================
STUDENT EXPERIENCE PRINCIPLE
============================

The core experience must be extremely simple:

Within a short amount of time, a student should be able to:

1. Find discounted food
2. Understand the food information
3. Reserve or purchase it
4. Complete payment
5. Receive a QR code
6. Pick up the food

==================================================
MAIN PRODUCT POSITIONING
========================

SaveMakan is not only a discounted food marketplace.

It is a campus food rescue and food waste intelligence platform that connects:

FOOD VENDORS
→ SURPLUS FOOD
→ DISCOUNTED FOOD
→ STUDENTS
→ FOOD RESCUED

And for unavoidable waste:

UNSOLD FOOD
→ WASTE RECORD
→ ANALYTICS
→ ORGANIC WASTE MANAGEMENT
→ COMPOST / RECYCLING

The primary sustainability focus is:
SDG 12 — Responsible Consumption and Production.

SDG 2 — Zero Hunger and SDG 13 — Climate Action may be presented as supporting impact areas, but SDG 12 should remain the primary SDG.

==================================================
PROTOTYPE DEMONSTRATION FLOW
============================

Create a clear demo flow that can be used for judges:

SCENARIO 1 — SUCCESSFUL FOOD RESCUE

Vendor uploads surplus food
→ Student discovers discounted food
→ Student views food information
→ Student reserves
→ Student completes simulated payment
→ QR code generated
→ Vendor scans QR
→ Order completed
→ Meals Rescued metric increases

SCENARIO 2 — UNSOLD FOOD MANAGEMENT

Food listing ends
→ Remaining quantity exists
→ Vendor records unsold food
→ Vendor evaluates whether it can still be recovered
→ If suitable: relist or recover
→ If unsuitable: record organic waste
→ Compost partner receives collection request
→ Waste is collected and processed
→ Sustainability dashboard updates

==================================================
FINAL DESIGN REQUIREMENTS
=========================

Make the prototype feel like a complete, credible, scalable startup product.

Prioritise:

* Clear user flows
* Realistic states
* Strong usability
* Professional visual hierarchy
* Consistent components
* Clear role permissions
* Data-driven sustainability impact
* Smooth demo experience

The prototype should be impressive for innovation competition judges while still being realistic enough to become a real product.

Do not create only static landing pages.
Create an interactive product experience with multiple screens, clickable navigation, realistic states, dashboards, forms, modals, alerts, confirmation screens, and error states.

The final product should communicate this core idea:

“Every meal saved is one less meal wasted.”
