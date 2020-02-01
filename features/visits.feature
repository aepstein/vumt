Feature: Manage visits
    In order to legally and safely visit the forest preserve
    As a visitor to the forest preserve
    I want to be able to create, modify, and delete visits

    Background:
        Given an origin "Adirondack Loj" exists
        And a destination "Algonquin Summit" exists

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

    Scenario: Edit a visit
        Given an origin "Johns Brook Garden" exists
        And a destination "Marcy Summit" exists
        And I am registered as "bmarshall@example.com"
        And I have registered a visit for tomorrow from "Adirondack Loj" to "Algonquin Summit"
        And I logged in as "bmarshall@example.com"
        When I visit the "home" page
        And I click "Edit" for my visit for tomorrow from "Adirondack Loj" to "Algonquin Summit"
        When I fill in a visit for today from "Johns Brook Garden" to "Marcy Summit"
        And I fill in "Start time" with "09:00AM"
        And I click the "Edit visit" button
        Then I should see my visit for today from "Johns Brook Garden" to "Marcy Summit"
        When I click the "Detail" button
        Then I should see "Date of visit" defined as today
        And I should see "Start time" defined as "9:00:00 AM"
        And I should see "Starting point" defined as "Johns Brook Garden"
        And I should see "Destinations" defined as "Marcy Summit"

    Scenario: Add visit
        Given I am registered as "bmarshall@example.com"
        And I logged in as "bmarshall@example.com"
        And I visit the "new visit" page
        When I fill in a visit for tomorrow from "Adirondack Loj" to "Algonquin Summit"
        And I click the "Add visit" button
        Then I should see my visit for tomorrow from "Adirondack Loj" to "Algonquin Summit"

    Scenario Outline: Try to add invalid visit
        Given I am registered as "bmarshall@example.com"
        And I logged in as "bmarshall@example.com"
        When I visit the "new visit" page
        When I fill in a visit for tomorrow from "Adirondack Loj" to "Algonquin Summit" except "<field>"
        And I click the "Add visit" button
        Then the "<field>" field should have an error "Cannot be blank"
        Examples:
            | field                     |
            | Date of visit             |
            | Start time                |
            | Starting point            |
            | Number of people in group |
            | Duration in nights        |

    Scenario Outline: Try to add visit with invalid values
        Given I am registered as "bmarshall@example.com"
        And I logged in as "bmarshall@example.com"
        When I visit the "new visit" page
        When I fill in a visit for tomorrow from "Adirondack Loj" to "Algonquin Summit"
        And I fill in "<field>" with "<value>"
        And I click the "Add visit" button
        Then the "<field>" field should have an error "<message>"
        Examples:
            | field                     | value | message                |
            | Number of people in group | -1    | Must be at least 1     |
            | Number of people in group | 2.5   | Must be a whole number |
            | Duration in nights        | -1    | Must be at least 0     |
            | Duration in nights        | 0.5   | Must be a whole number |

    Scenario: Check in to a visit
        Given I am registered as "bmarshall@example.com"
        And I have registered a visit for today from "Adirondack Loj" to "Algonquin Summit"
        And I logged in as "bmarshall@example.com"
        When I visit the "home" page
        And I click "Check in" for my visit for today from "Adirondack Loj" to "Algonquin Summit"
        And I fill in "Check in date" with today
        And I fill in "Check in time" with "805A"
        And I click the "Check in" button
        And I take a screenshot
        And I click the "Detail" button
        Then I should see "Check in date" defined as today
        And I should see "Check in time" defined as "8:05:00 AM"

    Scenario: Remove visit
        Given I am registered as "bmarshall@example.com"
        And I have registered a visit for tomorrow from "Adirondack Loj" to "Algonquin Summit"
        And I logged in as "bmarshall@example.com"
        When I visit the "home" page
        And I click "Remove" for my visit for tomorrow from "Adirondack Loj" to "Algonquin Summit"
        Then I wait for my visit for tomorrow from "Adirondack Loj" to "Algonquin Summit" to disappear
