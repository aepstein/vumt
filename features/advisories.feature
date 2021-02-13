Feature: Manage advisories
    In order to provide notice to visitors of important regulations and considerations
    As an administrator of the system
    I want to be able to create, modify, and delete advisories

    Background:
        Given an admin user exists "Barbara" "McMartin" "bmcmartin@example.com"
        And a district "McIntyre Range" exists
        And a theme "Information" exists
        And an advisory "Leave No Trace" exists
        And the advisory "Leave No Trace" has "en-US" prompt "Respect your surroundings."

    Scenario: Unauthenticated context advisories
        Given an advisory "Welcome" exists
        And the advisory "Welcome" has "en-US" prompt "This is something you see when you have not logged in."
        And the advisory "Welcome" has context "unauthenticated"
        And the advisory "Leave No Trace" has context "checkin"
        When I visit the "home" page
        Then I should see an applicable advisory for "Welcome" prompting "This is something you see when you have not logged in."
        Then I should not see an applicable advisory for "Leave No Trace" prompting "Respect your surroundings"

    Scenario: See advisories
        Given I logged in as "bmcmartin@example.com"
        When I visit the "advisories" page
        Then I should see advisory "Leave No Trace"

    Scenario: Search advisories with pagination
        Given I logged in as "bmcmartin@example.com"
        And 11 advisories exist
        When I visit the "advisories" page
        And I fill in "Search" with "advisory"
        And there is no spinner
        Then I should see advisories 2 through 11
        And I should not see advisory "Leave No Trace"
        When I click the "More" button
        And there is no spinner
        Then I should see advisories 2 through 12
        And I should not see advisory "Leave No Trace"

    Scenario: Edit an advisory
        Given I logged in as "bmcmartin@example.com"
        And a district "Other Range" exists
        And a theme "Safety" exists
        When I visit the "advisories" page
        And I click "Edit" for advisory "Leave No Trace"
        And I fill in the "Theme" typeahead with "Safety"
        And I fill in "Label" with "Leave Only Footprints, Take Only Pictures"
        And I fill in "Start date" with tomorrow
        And I fill in "Start time" with "900A"
        And I fill in "End date" with tomorrow
        And I fill in "End time" with "1000A"
        And I fill in the "Districts" typeahead with "Other Range"
        And I fill in the "Contexts" typeahead with "check in"
        And I fill in the "English" textarea with "Respect your environment please."
        And I click the "Update advisory" button
        And I click "Detail" for advisory "Leave Only Footprints, Take Only Pictures"
        Then I should see "Theme" defined as "Safety"
        And I should see "Label" defined as "Leave Only Footprints, Take Only Pictures"
        And I should see "Start date" defined as tomorrow
        And I should see "Start time" defined as "9:00:00 AM"
        And I should see "End date" defined as tomorrow
        And I should see "End time" defined as "10:00:00 AM"
        And I should see "Districts" defined as "Other Range"
        And I should see "Contexts" defined as "check in"
        And I should see "English" defined as "Respect your environment please."

    Scenario: Add a new advisory
        Given I logged in as "bmcmartin@example.com"
        When I visit the "advisories" page
        And I click the "Add advisory" button
        And I fill in values for the advisory
        And I click the "Add advisory" button
        And I click "Detail" for advisory "Stay Safe"
        Then I should see "Theme" defined as "Information"
        And I should see "Label" defined as "Stay Safe"
        And I should see "Start date" defined as today
        And I should see "Start time" defined as "8:00:00 AM"
        And I should see "End date" defined as today
        And I should see "End time" defined as "9:00:00 AM"
        And I should see "Districts" defined as "McIntyre Range"
        And I should see "Contexts" defined as "check out"

    Scenario Outline: Try to add invalid advisory
        Given I logged in as "bmcmartin@example.com"
        When I visit the "advisories" page
        And I click the "Add advisory" button
        And I fill in values for the advisory except "<field>"
        And I click the "Add advisory" button
        Then the "<field>" field should have an error "Cannot be blank"
        Examples:
            | field                          |
            | Theme                          |
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
