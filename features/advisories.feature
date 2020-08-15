Feature: Manage advisories
    In order to provide notice to visitors of important regulations and considerations
    As an administrator of the system
    I want to be able to create, modify, and delete advisories

    Background:
        Given an admin user exists "Barbara" "McMartin" "bmcmartin@example.com"
        And an advisory "Leave No Trace" exists

    Scenario: See advisories
        Given I logged in as "bmcmartin@example.com"
        When I visit the "advisories" page
        Then I should see advisory "Leave No Trace"

    Scenario: Edit an advisory
        Given I logged in as "bmcmartin@example.com"
        When I visit the "advisories" page
        And I click "Edit" for advisory "Leave No Trace"
        And I fill in "Label" with "Leave Only Footprints, Take Only Pictures"
        And I fill in "Prompt" with "Respect your surroundings."
        And I click the "Update advisory" button
        And I click "Detail" for advisory "Leave Only Footprints, Take Only Pictures"
        Then I should see "Label" defined as "Leave Only Footprints, Take Only Pictures"
        And I should see "Prompt" defined as "Respect your surroundings."

    Scenario: Add a new advisory
        Given I logged in as "bmcmartin@example.com"
        When I visit the "advisories" page
        And I click the "Add advisory" button
        And I fill in values for the advisory
        And I click the "Add advisory" button
        And I click "Detail" for advisory "Stay Safe"
        Then I should see "Label" defined as "Stay Safe"
        And I should see "Prompt" defined as "Bring a map, compass, and headlamp."

    Scenario Outline: Try to add invalid advisory
        Given I logged in as "bmcmartin@example.com"
        When I visit the "advisories" page
        And I click the "Add advisory" button
        And I fill in values for the advisory except "<field>"
        And I click the "Add advisory" button
        Then the "<field>" field should have an error "Cannot be blank"
        Examples:
            | field                          |
            | Label                          |