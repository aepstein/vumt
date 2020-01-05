Feature: Authentication
    In order to manage personal information
    As a user of the tool
    I want to be able to register, login, and logout
    
    Scenario: Register new user
        When I visit the "home" page
        And I register as a "bmarshall@example.com"
        Then I should be logged in as "bmarshall@example.com"
    
    Scenario: Log in as registered user
        Given I am registered as "bmarshall@example.com"
        When I visit the "home" page
        And I log in as "bmarshall@example.com"
        Then I should be logged in as "bmarshall@example.com"