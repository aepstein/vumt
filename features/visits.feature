Feature: Manage visits
    In order to legally and safely visit the forest preserve
    As a visitor to the forest preserve
    I want to be able to create, modify, and delete visits

    Background:
        Given an origin "Adirondack Loj" exists at "44.183102,-73.963584"
        And a destination "Algonquin Summit" exists at "44.143669,-73.986525"
        And a destination "Marcy Summit" exists at "44.11277,-73.9237"

    Scenario: See visits
        Given I am registered as "bmarshall@example.com"
        And I have registered a visit for tomorrow from "Adirondack Loj" to "Algonquin Summit"
        And I logged in as "bmarshall@example.com"
        When I visit the "home" page
        Then I should see my visit for tomorrow from "Adirondack Loj" to "Algonquin Summit"
        When I click the "Detail" button
        Then I should see "Date of visit" defined as tomorrow
        And I should see "Start time" defined as "8:00:00 AM"
        And I should see "Starting point" defined as "Adirondack Loj"
        And I should see "Destinations" defined as "Algonquin Summit"
        And I should see "Number of people in group" defined as "4"
        And I should see "Duration in nights" defined as "0"
        And I should see "Number of vehicles parked at starting point" defined as "1"

    Scenario: Search visits with pagination
        Given a user exists "Barbara" "McMartin" "bmcmartin@example.com"
        And I logged in as "bmcmartin@example.com"
        And I registered 11 visits from "Adirondack Loj" to "Algonquin Summit"
        And I have registered a visit for tomorrow from "Adirondack Loj" to "Marcy Summit"
        When I visit the "home" page
        And I fill in "Search" with "algonquin"
        Then I should see visits 1 through 10
        And I click the "More" button
        And there is no spinner
        Then I should see visits 1 through 11
        And I should not see visit 12

    Scenario: Edit a visit
        Given an origin "Johns Brook Garden" exists
        And I am registered as "bmarshall@example.com"
        And I have registered a visit for tomorrow from "Adirondack Loj" to "Algonquin Summit"
        And I logged in as "bmarshall@example.com"
        When I visit the "home" page
        And I click "Edit" for my visit for tomorrow from "Adirondack Loj" to "Algonquin Summit"
        When I fill in a visit for today from "Johns Brook Garden" to "Marcy Summit"
        And I fill in "Start time" with "09:00AM"
        And I fill in "Number of vehicles parked at starting point" with "0"
        And I click the "Edit visit" button
        Then I should see my visit for today from "Johns Brook Garden" to "Marcy Summit"
        When I click the "Detail" button
        Then I should see "Date of visit" defined as today
        And I should see "Start time" defined as "9:00:00 AM"
        And I should see "Starting point" defined as "Johns Brook Garden"
        And I should see "Destinations" defined as "Marcy Summit"
        And I should see "Number of vehicles parked at starting point" defined as "0"

    Scenario: Add visit
        Given I am registered as "bmarshall@example.com"
        And I logged in as "bmarshall@example.com"
        And I visit the "new visit" page
        When I fill in a visit for tomorrow from "Adirondack Loj" to "Algonquin Summit"
        And I click the "Add visit" button
        Then I should see my visit for tomorrow from "Adirondack Loj" to "Algonquin Summit"

    Scenario: Select origin with geolocation
        Given I am registered as "bmarshall@example.com"
        And an origin "Johns Brook Garden" exists at "44.189006,-73.816306"
        And I logged in as "bmarshall@example.com"
        And my location is "44.189006,-73.816306"
        And I visit the "new visit" page
        And I click on the "Starting point" typeahead
        Then the 1st option in the typeahead should contain "Johns Brook Garden"
        And the 1st option in the typeahead should contain "0 miles away"
        And the 2nd option in the typeahead should contain "Adirondack Loj"
        And the 2nd option in the typeahead should contain "7 miles away"

    Scenario: Select origin with utilization stats
        Given I am registered as "bmarshall@example.com"
        And an origin "Johns Brook Garden" exists at "44.189006,-73.816306"
        And a visit starts from "Adirondack Loj" to "Algonquin Summit" 1 hour from now with 2 people and 1 vehicle
        And a visit started from "Adirondack Loj" to "Algonquin Summit" 1 hour ago with 4 people and 2 vehicles
        And I logged in as "bmarshall@example.com"
        And my location is "44.183102,-73.963584"
        And I visit the "new visit" page
        And I fill in "Date of visit" with today
        And I fill in "Start time" with 0 minutes ago
        And I click on the "Starting point" typeahead
        Then the 1st option in the typeahead should contain "Adirondack Loj"
        And the 1st option in the typeahead should contain "1 party"
        And the 1st option in the typeahead should contain "4 people"
        And the 1st option in the typeahead should contain "2 parked vehicles"

    Scenario: Select destination relative to origin
        Given I am registered as "bmarshall@example.com"
        And I logged in as "bmarshall@example.com"
        And I visit the "new visit" page
        And I fill in the "Starting point" typeahead with "Adirondack Loj"
        And I click on the "Destinations" typeahead
        Then the 1st option in the typeahead should contain "Algonquin Summit"
        And the 1st option in the typeahead should contain "3 miles from Adirondack Loj"
        And the 2nd option in the typeahead should contain "Marcy Summit"
        And the 2nd option in the typeahead should contain "5 miles from Adirondack Loj"

    Scenario Outline: Try to add invalid visit
        Given I am registered as "bmarshall@example.com"
        And I logged in as "bmarshall@example.com"
        When I visit the "new visit" page
        When I fill in a visit for tomorrow from "Adirondack Loj" to "Algonquin Summit" except "<field>"
        And I click the "Add visit" button
        Then the "<field>" field should have an error "Cannot be blank"
        Examples:
            | field                                       |
            | Date of visit                               |
            | Start time                                  |
            | Starting point                              |
            | Number of people in group                   |
            | Duration in nights                          |
            | Number of vehicles parked at starting point |

    Scenario Outline: Try to add visit with invalid values
        Given I am registered as "bmarshall@example.com"
        And I logged in as "bmarshall@example.com"
        When I visit the "new visit" page
        When I fill in a visit for tomorrow from "Adirondack Loj" to "Algonquin Summit"
        And I fill in "<field>" with "<value>"
        And I click the "Add visit" button
        Then the "<field>" field should have an error "<message>"
        Examples:
            | field                                       | value | message                |
            | Number of people in group                   | -1    | Must be at least 1     |
            | Number of people in group                   | 2.5   | Must be a whole number |
            | Duration in nights                          | -1    | Must be at least 0     |
            | Duration in nights                          | 0.5   | Must be a whole number |
            | Number of vehicles parked at starting point | -1    | Must be at least 0     |
            | Number of vehicles parked at starting point | 0.5   | Must be a whole number |

    Scenario: Check in/out of a visit
        Given I am registered as "bmarshall@example.com"
        And a theme "LNT" exists
        And the theme "LNT" has "en-US" label "Leave No Trace"
        And an advisory "footprints" exists
        And the advisory "footprints" has theme "LNT"
        And the advisory "footprints" has context "checkin"
        And the advisory "footprints" has "en-US" prompt "Leave only footprints, take only pictures"
        And an advisory "Complete Survey" exists
        And the advisory "Complete Survey" has theme "LNT"
        And the advisory "Complete Survey" has context "checkout"
        And the advisory "Complete Survey" has "en-US" prompt "Please complete this survey to tell us how it went."
        And I have registered a visit for 10 minutes ago from "Adirondack Loj" to "Algonquin Summit"
        And I logged in as "bmarshall@example.com"
        When I visit the "home" page
        And I click "Check in" for my visit for today from "Adirondack Loj" to "Algonquin Summit"
        And there is no spinner
        Then I should see an applicable advisory for "Leave No Trace" prompting "Leave only footprints, take only pictures"
        And I should not see an applicable advisory for "Leave No Trace" prompting "Please complete this survey to tell us how it went."
        When I fill in "Check in date" with today
        And I fill in "Check in time" with 5 minutes ago
        And I click the "Check in" button
        And I click "Detail" for my visit for today from "Adirondack Loj" to "Algonquin Summit"
        Then I should see "Check in date" defined as today
        And I should see "Check in time" defined as 5 minutes ago
        When I visit the "home" page
        And I click "Check out" for my visit for today from "Adirondack Loj" to "Algonquin Summit"
        And there is no spinner
        Then I should not see an applicable advisory for "Leave No Trace" prompting "Leave only footprints, take only pictures"
        And I should see an applicable advisory for "Leave No Trace" prompting "Please complete this survey to tell us how it went."
        When I fill in "Check out date" with today
        And I fill in "Check out time" with 1 minute ago
        And I click the "Check out" button
        And I click "Detail" for my visit for today from "Adirondack Loj" to "Algonquin Summit"
        Then I should see "Check out date" defined as today
        And I should see "Check out time" defined as 1 minute ago

    Scenario: See applicable advisory on check in different languages
        Given a theme "Leave No Trace" exists
        And the theme "Leave No Trace" has "en-US" label "Leave No Trace"
        And the theme "Leave No Trace" has "fr" label "Ne laisse aucune trace"
        And an advisory "Leave No Trace" exists
        And the advisory "Leave No Trace" has "en-US" prompt "Respect your surroundings"
        And the advisory "Leave No Trace" has "fr" prompt "Respectez votre environnement"
        And the advisory "Leave No Trace" has theme "Leave No Trace"
        And I am registered as "bmarshall@example.com"
        And I have registered a visit for today from "Adirondack Loj" to "Algonquin Summit"
        And I logged in as "bmarshall@example.com"
        When I visit the "home" page
        And I click "Check in" for my visit for today from "Adirondack Loj" to "Algonquin Summit"
        Then I should see an applicable advisory for "Leave No Trace" prompting "Respect your surroundings"
        When I change the language to "Français"
        Then I should see an applicable advisory for "Ne laisse aucune trace" prompting "Respectez votre environnement"

    Scenario Outline: Remove/Cancel visit
        Given an admin user exists "Bob" "Marshall" "bmarshall@example.com"
        And I logged in as "bmarshall@example.com"
        And I have registered a visit for today from "Adirondack Loj" to "Marcy Summit"
        And I have registered a visit for tomorrow from "Adirondack Loj" to "Algonquin Summit"
        When I visit the "home" page
        And I click "<action>" for my visit for tomorrow from "Adirondack Loj" to "Algonquin Summit"
        Then I wait for my visit for tomorrow from "Adirondack Loj" to "Algonquin Summit" to disappear
        Examples:
            |action|
            |Remove|
            |Cancel|
