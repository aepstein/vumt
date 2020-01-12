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
            | Starting point            |
            | Number of people in group |
@wip
    Scenario Outline: Try to add visit with invalid group size
        Given I am registered as "bmarshall@example.com"
        And I logged in as "bmarshall@example.com"
        When I visit the "new visit" page
        When I fill in a visit for tomorrow from "Adirondack Loj" to "Algonquin Summit"
        And I fill in "Number of people in group" with "<value>"
        And I click the "Add visit" button
        Then the "Number of people in group" field should have an error "<message>"
        Examples:
            | value | message                |
            | -1    | Must be at least 1     |
            | 2.5   | Must be a whole number |
    
    Scenario: Remove visit
        Given I am registered as "bmarshall@example.com"
        And I have registered a visit for tomorrow from "Adirondack Loj" to "Algonquin Summit"
        And I logged in as "bmarshall@example.com"
        When I visit the "home" page
        And I delete the visit to "Algonquin Summit"
        Then I should not see my visit for tomorrow from "Adirondack Loj" to "Algonquin Summit"
