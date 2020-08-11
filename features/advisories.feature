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
