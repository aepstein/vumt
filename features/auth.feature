Feature: Authentication
    In order to manage personal information
    As a user of the tool
    I want to be able to register, login, and logout

    Scenario: Register new user
        When I visit the "home" page
        And I click the "Register" link
        And I fill in a new registration for "bmarshall@example.com"
        And I click the "Register" button
        Then I should be logged in as "bmarshall@example.com"

    Scenario Outline: Register a user with required field missing
        When I visit the "home" page
        And I click the "Register" link
        And I fill in a new registration for "bmarshall@example.com" except "<field>"
        And I click the "Register" button
        Then the "<field>" field should have an error "Cannot be blank"
        Examples:
            | field                         |
            | First name                    |
            | Last name                     |
            | Email                         |
            | Password                      |
            | Country                       |
            | State, province, or territory |
            | Postal code                   |

    Scenario Outline: Register a user with invalid field
        Given a user exists "Double" "Double" "dup@example.com"
        When I visit the "home" page
        And I click the "Register" link
        And I fill in a new registration for "bmarshall@example.com"
        And I fill in "<field>" with "<value>"
        And I click the "Register" button
        Then the "<field>" field should have an error "<message>"
        Examples:
            | field       | value           | message                                                              |
            | Postal code | 1               | Must be correctly formatted postal code for United States of America |
            | Phone       | 555             | Must be correctly formatted phone number                             |
            | Email       | dup@example.com | Must be unique and `dup@example.com` is already used                 |

    Scenario: Log in as registered user
        Given I am registered as "bmarshall@example.com"
        When I visit the "home" page
        And I log in as "bmarshall@example.com"
        Then I should be logged in as "bmarshall@example.com"

    Scenario: Update registration of authenticated user
        Given I am registered as "bmarshall@example.com"
        And I logged in as "bmarshall@example.com"
        When I visit the "profile" page
        And I click the "Edit" button
        And I fill in a modified profile
        And I click the "Update profile" button
        Then I should see "First name" defined as "Herbert"
        And I should see "Last name" defined as "Clark"
        And I should see "Email" defined as "hclark@example.com"
        And I should see "Country" defined as "Canada"
        And I should see "State, province, or territory" defined as "Quebec"
        And I should see "Postal code" defined as "H2T 2M2"
        And I should see "Phone" defined as "+15142720667"
        And I should see "Use device location" defined as "No"