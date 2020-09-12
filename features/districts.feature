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

    Scenario: Edit a district
        Given I logged in as "bmcmartin@example.com"
        When I visit the "districts" page
        And I click "Edit" for district "McIntyre Range"
        And I fill in "Name" with "Great Range"
        And I click the "Update district" button
        And I click "Detail" for district "Great Range"
        Then I should see "Name" defined as "Great Range"
    