To add a slideshow to the main page:
-Open index.html.
-The slideshow section is in a <section> tag with the class name "hero-section". Uncomment this <section> tag. The slideshow section comes with 3 slides by default. Modify them as needed.
-Remove the class name "header-normal" from the <header> tag.
-Comment the <section> with the class name "breadcrumb-section" right below the slideshow section to hide it.

To modify the schedule filters:
-Open schedule.html.
-Find the <section> tag with the class name "classtime-section". This contains the schedule section.
-In the schedule section, find the <div> tag with class name "timetable-controls". This contains a list of filters. Every list item has an attribute named data-tsfilter. Set a unique identifier for this attribute.
-Below the <div> tag with the "timetable-controls" class name, there's a <div> tag with the "classtime-table" class name containing the actual schedule in a <table> tag. In this <table> tag, every inner <td> tag represents a class time slot. Each <td> tag has an attribute named data-tsmeta. Set the corresponding filter value from the data-tsfilter attribute set earlier as the value for the data-tsmeta attribute.

To add testimonials:
-Open about-us.html.
-Find the <section> tags with the class name "testimonial-section". There are 2 tag instances.
-Comment or delete the first <section> tag.
-Uncomment the second <section> tag. The testimonial section comes with 3 testimonials by default. Modify them as needed.