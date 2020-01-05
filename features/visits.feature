Feature: Manage visits
    In order to legally and safely visit the forest preserve
    As a visitor to the forest preserve
    I want to be able to create, modify, and delete visits
    
    Scenario: See visits
        Given I am registered as "bmarshall@example.com"
        And I have registered a visit to "Algonquin"
        And I logged in as "bmarshall@example.com"
        When I visit the "home" page
        Then I should see my visit to "Algonquin"

    Scenario: Add visit
        Given I am registered as "bmarshall@example.com"
        And I logged in as "bmarshall@example.com"
        And an origin "Adirondack Loj" exists
        And a destination "Algonquin Summit" exists
        When I add a visit from "Adirondack Loj" to "Algonquin Summit"
        Then I should see my visit to "Algonquin Summit"
    
    Scenario: Remove visit
        Given I am registered as "bmarshall@example.com"
        And I have registered a visit to "Algonquin"
        And I logged in as "bmarshall@example.com"
        When I visit the "home" page
        And I delete the visit to "Algonquin"
        Then I should not see my visit to "Algonquin"
