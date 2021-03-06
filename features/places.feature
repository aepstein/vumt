Feature: Manage places
    In order to maintain locations from and to which visits can go
    As an administrator of the system
    I want to be able to create, modify, and delete places

    Background:
        Given an admin user exists "Barbara" "McMartin" "bmcmartin@example.com"
        And a destination "Pitchoff Summit" exists

    Scenario: See places
        Given I logged in as "bmcmartin@example.com"
        When I visit the "places" page
        Then I should see place "Pitchoff Summit"

    Scenario: Search places with pagination
        Given I logged in as "bmcmartin@example.com"
        And 10 places exist
        And a place "special place" exists
        When I visit the "places" page
        And I fill in "Search" with "place"
        Then I should see places 2 through 12
        And I should not see place "special place"
        When I click the "More" button
        And there is no spinner
        Then I should see places 2 through 13
        And I should not see place "Pitchoff Summit"

    Scenario: Edit a place
        Given I logged in as "bmcmartin@example.com"
        When I visit the "places" page
        And I click "Edit" for place "Pitchoff Summit"
        And I fill in "Name" with "Upper Cascade Lake Launch"
        And I fill in "Latitude" with "45"
        And I fill in "Longitude" with "-75"
        And I mark the "Is a starting point" checkbox
        And I unmark the "Is a destination" checkbox
        And I fill in "Number of public parking spots" with "8"
        And I fill in the "Timezone" typeahead with "America/Chicago"
        And I click the "Update place" button
        And I click "Detail" for place "Upper Cascade Lake Launch"
        Then I should see "Name" defined as "Upper Cascade Lake Launch"
        And I should see "Location" defined as "45,-75"
        And I should see "Is a starting point" defined as "Yes"
        And I should see "Is a destination" defined as "No"
        And I should see "Number of public parking spots" defined as "8"
        And I should see "Timezone" defined as "America/Chicago"

    Scenario: Add a new place
        Given I logged in as "bmcmartin@example.com"
        When I visit the "places" page
        And I click the "Add place" button
        And I fill in values for the place
        And I click the "Add place" button
        And I click "Detail" for place "Upper Cascade Lake Launch"
        Then I should see "Name" defined as "Upper Cascade Lake Launch"
        And I should see "Location" defined as "45,-75"
        And I should see "Is a starting point" defined as "Yes"
        And I should see "Is a destination" defined as "Yes"
        And I should see "Number of public parking spots" defined as "8"
        And I should see "Timezone" defined as "America/Chicago"

    Scenario Outline: Try to add invalid place
        Given I logged in as "bmcmartin@example.com"
        When I visit the "places" page
        And I click the "Add place" button
        And I fill in values for the place except "<field>"
        And I click the "Add place" button
        Then the "<field>" field should have an error "Cannot be blank"
        Examples:
            | field                          |
            | Name                           |
            | Latitude                       |
            | Longitude                      |
            | Number of public parking spots |
            | Timezone                       |

    Scenario Outline: Try to add place with invalid values
        Given I logged in as "bmcmartin@example.com"
        And an origin "Existing" exists
        When I visit the "places" page
        And I click the "Add place" button
        And I fill in values for the place except "<field>"
        And I fill in "<field>" with "<value>"
        And I click the "Add place" button
        Then the "<field>" field should have an error "<message>"
        Examples:
            | field                          | value    | message                                       |
            | Latitude                       | -1       | Must be at least 0                            |
            | Latitude                       | 91       | Must not exceed 90                            |
            | Longitude                      | -181     | Must be at least -180                         |
            | Longitude                      | 181      | Must not exceed 180                           |
            | Number of public parking spots | -1       | Must be at least 0                            |
            | Number of public parking spots | 1.5      | Must be a whole number                        |
            | Name                           | Existing | Must be unique and `Existing` is already used |

    Scenario: Remove a place
        Given a destination "Marcy Summit" exists
        And I logged in as "bmcmartin@example.com"
        When I visit the "places" page
        And I click "Remove" for place "Pitchoff Summit"
        Then I wait for place "Pitchoff Summit" to disappear

    Scenario: Try to remove a place associated with a visit
        Given a destination "Marcy Summit" exists
        And an origin "Adirondak Loj" exists
        And I have registered a visit for tomorrow from "Adirondak Loj" to "Marcy Summit"
        And I logged in as "bmcmartin@example.com"
        When I visit the "places" page
        And I click "Remove" for place "Marcy Summit"
        Then I should see a notice "Cannot remove the place because it is part of destinations in a dependent visit"
        And I should see places 1 through 3

