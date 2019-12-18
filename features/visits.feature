Feature: Manage visits
    In order to legally and safely visit the forest preserve
    As a visitor to the forest preserve
    I want to be able to create, modify, and delete visits
    @wip
    Scenario: Add visit
        Given I am registered as "bmarshall@example.com"
        And I have registered a visit to "Algonquin"
        And I logged in as "bmarshall@example.com"
        When I visit the "home" page
        And the page is loaded
        Then I should see my visit to "Algonquin"
