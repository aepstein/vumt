Feature: Manage advisories
    In order to provide notice to visitors of important regulations and considerations
    As an administrator of the system
    I want to be able to create, modify, and delete advisories

    Background:
        Given an admin user exists "Barbara" "McMartin" "bmcmartin@example.com"
        And a district "McIntyre Range" exists
        And an advisory "Leave No Trace" exists

    Scenario: See advisories
        Given I logged in as "bmcmartin@example.com"
        When I visit the "advisories" page
        Then I should see advisory "Leave No Trace"

    Scenario: Edit an advisory
        Given I logged in as "bmcmartin@example.com"
        And a district "Other Range" exists
        When I visit the "advisories" page
        And I click "Edit" for advisory "Leave No Trace"
        And I fill in "Label" with "Leave Only Footprints, Take Only Pictures"
        And I fill in "Prompt" with "Respect your surroundings."
        And I fill in "Start date" with tomorrow
        And I fill in "Start time" with "900A"
        And I fill in "End date" with tomorrow
        And I fill in "End time" with "1000A"
        And I fill in the "Districts" typeahead with "Other Range"
        And I click the "Update advisory" button
        And I click "Detail" for advisory "Leave Only Footprints, Take Only Pictures"
        Then I should see "Label" defined as "Leave Only Footprints, Take Only Pictures"
        And I should see "Prompt" defined as "Respect your surroundings."
        And I should see "Start date" defined as tomorrow
        And I should see "Start time" defined as "9:00:00 AM"
        And I should see "End date" defined as tomorrow
        And I should see "End time" defined as "10:00:00 AM"
        And I should see "Districts" defined as "Other Range"

    Scenario: Add a new advisory
        Given I logged in as "bmcmartin@example.com"
        When I visit the "advisories" page
        And I click the "Add advisory" button
        And I fill in values for the advisory
        And I click the "Add advisory" button
        And I click "Detail" for advisory "Stay Safe"
        Then I should see "Label" defined as "Stay Safe"
        And I should see "Prompt" defined as "Bring a map, compass, and headlamp."
        And I should see "Start date" defined as today
        And I should see "Start time" defined as "8:00:00 AM"
        And I should see "End date" defined as today
        And I should see "End time" defined as "9:00:00 AM"
        And I should see "Districts" defined as "McIntyre Range"

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

    Scenario: Try to add invalid advisory
        Given I logged in as "bmcmartin@example.com"
        When I visit the "advisories" page
        And I click the "Add advisory" button
        And I fill in values for the advisory except "End time"
        And I fill in "End time" with "500A"
        And I click the "Add advisory" button
        Then the "Start date" field should have an error "Must be before end date"

    Scenario: Remove a advisory
        Given an advisory "Stay Safe" exists
        And I logged in as "bmcmartin@example.com"
        When I visit the "advisories" page
        And I click "Remove" for advisory "Stay Safe"
        Then I wait for advisory "Stay Safe" to disappear
