Feature: Authentication
    In order to manage personal information
    As a user of the tool
    I want to be able to register, login, and logout
   
    Scenario: Register new user
        When I visit the "home" page
        And I fill in a new registration for "bmarshall@example.com"
        And I click the "Register" button
        Then I should be logged in as "bmarshall@example.com"
    
    Scenario: Try to register a user
        When I visit the "registration" page
        And I click the "Register" button
        Then the "First name" field should have an error "Cannot be blank"
        And the "Last name" field should have an error "Cannot be blank"
        And the "Email" field should have an error "Cannot be blank"
        And the "Password" field should have an error "Cannot be blank"

    Scenario: Log in as registered user
        Given I am registered as "bmarshall@example.com"
        When I visit the "home" page
        And I log in as "bmarshall@example.com"
        Then I should be logged in as "bmarshall@example.com"