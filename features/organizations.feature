Feature: Manage organizations
    In order to restrict advisories to geographic areas
    As an administrator of the system
    I want to be able to create, modify, and delete organizations

    Background:
        Given an admin user exists "Barbara" "McMartin" "bmcmartin@example.com"
        And a organization "Adirondack Trail Improvement Society" exists

    Scenario: Search memberships with pagination
        Given user "bmcmartin@example.com" has role "planner" in organization "Adirondack Trail Improvement Society"
        And I logged in as "bmcmartin@example.com"
        And 10 memberships with role "planner" exist in organization "Adirondack Trail Improvement Society"
        And a user exists "Bob" "Marshall 999" "bmarshall999@example.com"
        And user "bmarshall999@example.com" has role "ranger" in organization "Adirondack Trail Improvement Society"
        When I visit the "organizations" page
        And I click "Memberships" for organization "Adirondack Trail Improvement Society"
        And I fill in "Search" with "marshall"
        Then I should see memberships 2 through 11
        When I click the "More" button
        And there is no spinner
        Then I should see memberships 2 through 12
        And I should see the organization has no member "Barbara McMartin"
        When I fill in "Search" with "ranger"
        Then I should see memberships 13 through 13

    Scenario: Manage memberships
        Given a user exists "Bob" "Marshall" "bmarshall@example.com"
        And user "bmcmartin@example.com" has role "ranger" in organization "Adirondack Trail Improvement Society"
        And I logged in as "bmcmartin@example.com"
        When I visit the "organizations" page
        And I click "Memberships" for organization "Adirondack Trail Improvement Society"
        Then I should see the organization has a member "bmcmartin@example.com" with role "ranger"
        When I click "Edit" for the membership of "bmcmartin@example.com"
        And I fill in the "Roles" typeahead with "planner"
        And I click the "Update membership" button
        Then I should see the organization has a member "bmcmartin@example.com" with role "planner"
        When I click the "Add membership" button
        And I fill in the "User" typeahead with "Bob Marshall"
        And I fill in the "Roles" typeahead with "ranger"
        And I click the "Add membership" button
        Then I should see the organization has a member "bmarshall@example.com" with role "ranger"
        When I click "Remove" for the membership of "bmarshall@example.com"
        Then I should see the organization has no member "Bob Marshall"   

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
