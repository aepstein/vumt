Feature: Authentication
    In order to manage personal information
    As a user of the tool
    I want to be able to register, login, and logout

    Scenario: Register new user
        When I visit the "home" page
        And I fill in a new registration for "bmarshall@example.com"
        And I click the "Register" button
        Then I should be logged in as "bmarshall@example.com"

    Scenario Outline: Register a user with required field missing
        When I visit the "home" page
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

    Scenario: Log in as registered user
        Given I am registered as "bmarshall@example.com"
        When I visit the "home" page
        And I log in as "bmarshall@example.com"
        Then I should be logged in as "bmarshall@example.com"