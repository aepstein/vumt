Feature: Manage organizations
    In order to restrict advisories to geographic areas
    As an administrator of the system
    I want to be able to create, modify, and delete organizations

    Background:
        Given an admin user exists "Barbara" "McMartin" "bmcmartin@example.com"
        And a organization "Adirondack Trail Improvement Society" exists

    Scenario: See organizations
        Given I logged in as "bmcmartin@example.com"
        When I visit the "organizations" page
        Then I should see organization "Adirondack Trail Improvement Society"

    Scenario: Search organizations with pagination
        Given I logged in as "bmcmartin@example.com"
        And 10 organizations exist
        And a organization "special organization" exists
        When I visit the "organizations" page
        And I fill in "Search" with "organization"
        Then I should see organizations 2 through 12
        And I should not see organization "special organization"
        When I click the "More" button
        And there is no spinner
        Then I should see organizations 2 through 13
        And I should not see organization "Adirondack Trail Improvement Society"

    Scenario: Edit a organization
        Given I logged in as "bmcmartin@example.com"
        When I visit the "organizations" page
        And I click "Edit" for organization "Adirondack Trail Improvement Society"
        And I fill in "Name" with "Great Range"
        And I click the "Update organization" button
        And I click "Detail" for organization "Great Range"
        Then I should see "Name" defined as "Great Range"

    Scenario Outline: Try to add invalid organization
        Given I logged in as "bmcmartin@example.com"
        When I visit the "organizations" page
        And I click the "Add organization" button
        And I fill in values for the organization except "<field>"
        And I click the "Add organization" button
        Then the "<field>" field should have an error "Cannot be blank"
        Examples:
            | field                          |
            | Name                           |

    Scenario: Remove a organization
        Given I logged in as "bmcmartin@example.com"
        When I visit the "organizations" page
        And I click "Remove" for organization "Adirondack Trail Improvement Society"
        Then I wait for organization "Stay Safe" to disappear
