Feature: Manage districts
    In order to restrict advisories to geographic areas
    As an administrator of the system
    I want to be able to create, modify, and delete districts

    Background:
        Given an admin user exists "Barbara" "McMartin" "bmcmartin@example.com"
        And a district "McIntyre Range" exists

    Scenario: See districts
        Given I logged in as "bmcmartin@example.com"
        When I visit the "districts" page
        Then I should see district "McIntyre Range"

    Scenario: Search users with pagination
        Given I logged in as "bmcmartin@example.com"
        And 10 districts exist
        And a district "special district" exists
        When I visit the "districts" page
        And I fill in "Search" with "district"
        Then I should see districts 2 through 12
        And I should not see district "special district"
        When I click the "More" button
        Then I should see users 2 through 13
        And I should not see district "McIntyre Range"

    Scenario: Edit a district
        Given I logged in as "bmcmartin@example.com"
        When I visit the "districts" page
        And I click "Edit" for district "McIntyre Range"
        And I fill in "Name" with "Great Range"
        And I click the "Update district" button
        And I click "Detail" for district "Great Range"
        Then I should see "Name" defined as "Great Range"

    Scenario Outline: Try to add invalid district
        Given I logged in as "bmcmartin@example.com"
        When I visit the "districts" page
        And I click the "Add district" button
        And I fill in values for the district except "<field>"
        And I click the "Add district" button
        Then the "<field>" field should have an error "Cannot be blank"
        Examples:
            | field                          |
            | Name                           |

    Scenario: Remove a district
        Given I logged in as "bmcmartin@example.com"
        When I visit the "districts" page
        And I click "Remove" for district "McIntyre Range"
        Then I wait for district "Stay Safe" to disappear
