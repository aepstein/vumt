Feature: Manage users
    In order to monitor and control who uses the application
    As an administrator of the system
    I want to be able to create, modify, and delete users

    Background:
        Given an admin user exists "Barbara" "McMartin" "bmcmartin@example.com"
        And a user exists "Paul" "Schaefer" "pschaefer@example.com"

    Scenario Outline: See admin menu
        Given I logged in as "<email>"
        Then I <see> the "Administration" menu
        Examples:
            | email                 | see            |
            | bmcmartin@example.com | should see     |
            | pschaefer@example.com | should not see |
     
    Scenario: See users
        Given I logged in as "bmcmartin@example.com"
        When I visit the "users" page
        Then I should see user "bmcmartin@example.com"
        And I should see user "pschaefer@example.com"

    Scenario: Edit a user
        Given I logged in as "bmcmartin@example.com"
        When I visit the "users" page
        And I click "Edit" for user "pschaefer@example.com"
        And I fill in a modified profile
        And I click the "Update profile" button
        And I click "Detail" for user "hclark@example.com"
        Then I should see "First name" defined as "Herbert"
        And I should see "Last name" defined as "Clark"
        And I should see "Email" defined as "hclark@example.com"
        And I should see "Country" defined as "Canada"
        And I should see "State, province, or territory" defined as "Quebec"
        And I should see "Postal code" defined as "H2T 2M2"
        And I should see "Phone" defined as "+15142720667"

    Scenario: Add a new user
        Given I logged in as "bmcmartin@example.com"
        When I visit the "users" page
        And I click the "Add user" button
        And I fill in a new registration for "bmarshall@example.com"
        And I click the "Add user" button
        And I click "Detail" for user "bmarshall@example.com"
        Then I should see "First name" defined as "Bob"
        And I should see "Last name" defined as "Marshall"
        And I should see "Email" defined as "bmarshall@example.com"
        And I should see "Country" defined as "United States of America"
        And I should see "State, province, or territory" defined as "New York"
        And I should see "Postal code" defined as "12943"
        And I should see "Phone" defined as "+15185551212"

    Scenario: Remove a user
        Given I logged in as "bmcmartin@example.com"
        When I visit the "users" page
        And I click "Remove" for user "pschaefer@example.com"
        Then I wait for user "pschaefer@example.com" to disappear


        