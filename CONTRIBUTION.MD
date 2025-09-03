# Contributing to Health and Safety AI Detector System

Thank you for your interest in contributing to the **Health and Safety AI Detector System**! We value community contributions and aim to make the contribution process as smooth as possible. This document outlines the guidelines for contributing to the project.

## How to Contribute
1. **Fork the Repository**:
   - Fork the repository at [https://github.com/Mmabiaa/Health-and-Saftety-AI-detector](https://github.com/Mmabiaa/Health-and-Saftety-AI-detector).
   - Clone your fork to your local machine:
     ```bash
     git clone https://github.com/your-username/Health-and-Saftety-AI-detector.git
     ```

2. **Create a Branch**:
   - Create a new branch for your feature or bug fix:
     ```bash
     git checkout -b feature/your-feature-name
     ```

3. **Make Changes**:
   - Implement your feature or bug fix.
   - Ensure your code follows the project's coding standards (see below).
   - Write or update tests as necessary.

4. **Test Your Changes**:
   - Run the existing test suite to ensure nothing is broken:
     ```bash
     pytest
     ```
   - Test the frontend and backend locally to verify functionality.

5. **Commit Your Changes**:
   - Write clear and concise commit messages:
     ```bash
     git commit -m "Add feature: description of your changes"
     ```

6. **Push to Your Fork**:
   - Push your changes to your forked repository:
     ```bash
     git push origin feature/your-feature-name
     ```

7. **Create a Pull Request**:
   - Open a pull request (PR) against the `main` branch of the original repository.
   - Provide a detailed description of your changes in the PR.
   - Reference any related issues (e.g., `Fixes #123`).

8. **Code Review**:
   - Your PR will be reviewed by the maintainers.
   - Address any feedback or requested changes promptly.

## Coding Standards
- **Python**: Follow PEP 8 guidelines. Use `flake8` for linting.
- **JavaScript/React**: Follow Airbnb's JavaScript style guide. Use ESLint for linting.
- **Commit Messages**: Use clear, descriptive messages in the format: `[Type]: Brief description` (e.g., `Feature: Add PPE detection for gloves`).
- **Documentation**: Update relevant documentation (e.g., README, API docs) for any changes.
- **Tests**: Ensure all new features and bug fixes include appropriate unit and integration tests.

## Development Setup
- Install dependencies as outlined in the [README.md](README.md).
- Set up a local PostgreSQL database and configure the `.env` file.
- Use Docker for consistent development environments (optional).

## Reporting Bugs
- Open an issue on the GitHub repository with the following details:
  - A clear title and description of the bug.
  - Steps to reproduce the issue.
  - Expected and actual behavior.
  - Screenshots or logs, if applicable.

## Suggesting Features
- Open an issue with the `[Feature Request]` prefix in the title.
- Describe the proposed feature, its use case, and potential implementation ideas.
- Discuss with the community before starting development.

## Community Guidelines
- Be respectful and inclusive in all interactions.
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md) (if available).
- Provide constructive feedback during code reviews.

## Getting Help
If you have questions or need assistance, feel free to:
- Open an issue on the GitHub repository.
- Reach out to the maintainers via the repository's discussion section.

Thank you for contributing to the Health and Safety AI Detector System! Your efforts help make workplaces safer.