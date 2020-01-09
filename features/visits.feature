Feature: Manage visits
    In order to legally and safely visit the forest preserve
    As a visitor to the forest preserve
    I want to be able to create, modify, and delete visits

    Background:
        Given an origin "Adirondack Loj" exists
        And a destination "Algonquin Summit" exists

    Scenario: See visits
        Given I am registered as "bmarshall@example.com"
        And I have registered a visit from "Adirondack Loj" to "Algonquin Summit"
        And I logged in as "bmarshall@example.com"
        When I visit the "home" page
        Then I should see my visit to "Algonquin Summit"

    Scenario: Add visit
        Given I am registered as "bmarshall@example.com"
        And I logged in as "bmarshall@example.com"
        When I add a visit from "Adirondack Loj" to "Algonquin Summit"
        Then I should see my visit to "Algonquin Summit"
    
    Scenario: Try to add invalid visit
        Given I am registered as "bmarshall@example.com"
        And I logged in as "bmarshall@example.com"
        And I visit the "new visit" page
        And I click the "Add visit" button
    
    Scenario: Remove visit
        Given I am registered as "bmarshall@example.com"
        And I have registered a visit from "Adirondack Loj" to "Algonquin Summit"
        And I logged in as "bmarshall@example.com"
        When I visit the "home" page
        And I delete the visit to "Algonquin Summit"
        Then I should not see my visit to "Algonquin Summit"
