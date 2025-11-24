#!/usr/bin/env python3
"""
Comprehensive Backend Testing for Universal Translation App
Tests all API endpoints with various scenarios
"""

import requests
import json
import base64
import time
from datetime import datetime
import sys
import os

# Backend URL from environment
BACKEND_URL = "https://polyglotai-28.preview.emergentagent.com/api"

class TranslationAPITester:
    def __init__(self):
        self.backend_url = BACKEND_URL
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name, status, details="", response_data=None):
        """Log test results"""
        result = {
            "test": test_name,
            "status": status,
            "details": details,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.test_results.append(result)
        status_symbol = "✅" if status == "PASS" else "❌"
        print(f"{status_symbol} {test_name}: {details}")
        
    def test_root_endpoint(self):
        """Test the root API endpoint"""
        try:
            response = self.session.get(f"{self.backend_url}/")
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "status" in data:
                    self.log_test("Root Endpoint", "PASS", f"API is active: {data['message']}")
                    return True
                else:
                    self.log_test("Root Endpoint", "FAIL", "Missing expected fields in response")
                    return False
            else:
                self.log_test("Root Endpoint", "FAIL", f"Status code: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Root Endpoint", "FAIL", f"Exception: {str(e)}")
            return False
    
    def test_supported_languages(self):
        """Test supported languages endpoint"""
        try:
            response = self.session.get(f"{self.backend_url}/supported-languages")
            if response.status_code == 200:
                data = response.json()
                
                # Check structure
                if "spoken_languages" not in data or "sign_languages" not in data:
                    self.log_test("Supported Languages", "FAIL", "Missing spoken_languages or sign_languages")
                    return False
                
                spoken_count = len(data["spoken_languages"])
                sign_count = len(data["sign_languages"])
                
                # Verify counts as per requirements
                if spoken_count >= 100:
                    spoken_status = "PASS"
                else:
                    spoken_status = "FAIL"
                    
                if sign_count >= 8:
                    sign_status = "PASS"
                else:
                    sign_status = "FAIL"
                
                details = f"Spoken: {spoken_count} languages, Sign: {sign_count} languages"
                overall_status = "PASS" if spoken_status == "PASS" and sign_status == "PASS" else "FAIL"
                
                self.log_test("Supported Languages", overall_status, details, {
                    "spoken_count": spoken_count,
                    "sign_count": sign_count
                })
                return overall_status == "PASS"
            else:
                self.log_test("Supported Languages", "FAIL", f"Status code: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Supported Languages", "FAIL", f"Exception: {str(e)}")
            return False
    
    def test_text_translation(self):
        """Test text translation endpoint with multiple scenarios"""
        test_cases = [
            {
                "name": "English to Spanish",
                "text": "Hello, how are you?",
                "source": "en",
                "target": "es",
                "service": "openai"
            },
            {
                "name": "Spanish to French", 
                "text": "Hola, ¿cómo estás?",
                "source": "es",
                "target": "fr",
                "service": "openai"
            },
            {
                "name": "Chinese to English",
                "text": "你好",
                "source": "zh",
                "target": "en", 
                "service": "openai"
            }
        ]
        
        all_passed = True
        
        for case in test_cases:
            try:
                payload = {
                    "text": case["text"],
                    "source_language": case["source"],
                    "target_language": case["target"],
                    "service": case["service"]
                }
                
                response = self.session.post(f"{self.backend_url}/translate", json=payload)
                
                if response.status_code == 200:
                    data = response.json()
                    required_fields = ["id", "original_text", "translated_text", "source_language", "target_language", "service", "timestamp"]
                    
                    missing_fields = [field for field in required_fields if field not in data]
                    if missing_fields:
                        self.log_test(f"Translation - {case['name']}", "FAIL", f"Missing fields: {missing_fields}")
                        all_passed = False
                    elif data["translated_text"] and data["translated_text"] != case["text"]:
                        self.log_test(f"Translation - {case['name']}", "PASS", f"'{case['text']}' -> '{data['translated_text']}'")
                    else:
                        self.log_test(f"Translation - {case['name']}", "FAIL", "Translation returned empty or same text")
                        all_passed = False
                else:
                    self.log_test(f"Translation - {case['name']}", "FAIL", f"Status code: {response.status_code}, Response: {response.text}")
                    all_passed = False
                    
            except Exception as e:
                self.log_test(f"Translation - {case['name']}", "FAIL", f"Exception: {str(e)}")
                all_passed = False
        
        return all_passed
    
    def test_translation_error_cases(self):
        """Test translation error handling"""
        error_cases = [
            {
                "name": "Empty Text",
                "payload": {"text": "", "source_language": "en", "target_language": "es", "service": "openai"},
                "expected_status": [400, 422]
            },
            {
                "name": "Invalid Service",
                "payload": {"text": "Hello", "source_language": "en", "target_language": "es", "service": "invalid_service"},
                "expected_status": [400, 501]
            },
            {
                "name": "Google Service (Not Implemented)",
                "payload": {"text": "Hello", "source_language": "en", "target_language": "es", "service": "google"},
                "expected_status": [501]
            }
        ]
        
        all_passed = True
        
        for case in error_cases:
            try:
                response = self.session.post(f"{self.backend_url}/translate", json=case["payload"])
                
                if response.status_code in case["expected_status"]:
                    self.log_test(f"Translation Error - {case['name']}", "PASS", f"Correctly returned status {response.status_code}")
                else:
                    self.log_test(f"Translation Error - {case['name']}", "FAIL", f"Expected {case['expected_status']}, got {response.status_code}")
                    all_passed = False
                    
            except Exception as e:
                self.log_test(f"Translation Error - {case['name']}", "FAIL", f"Exception: {str(e)}")
                all_passed = False
        
        return all_passed
    
    def test_history_endpoint(self):
        """Test history endpoint"""
        try:
            # First make a translation to ensure there's history
            payload = {
                "text": "Test for history",
                "source_language": "en",
                "target_language": "es",
                "service": "openai"
            }
            self.session.post(f"{self.backend_url}/translate", json=payload)
            
            # Wait a moment for DB write
            time.sleep(1)
            
            # Now test history
            response = self.session.get(f"{self.backend_url}/history")
            
            if response.status_code == 200:
                data = response.json()
                
                if "history" in data and "count" in data:
                    history_count = data["count"]
                    if history_count > 0:
                        # Check if history items have proper structure
                        first_item = data["history"][0]
                        required_fields = ["id", "original_text", "translated_text", "timestamp"]
                        
                        missing_fields = [field for field in required_fields if field not in first_item]
                        if missing_fields:
                            self.log_test("History Endpoint", "FAIL", f"History items missing fields: {missing_fields}")
                            return False
                        else:
                            self.log_test("History Endpoint", "PASS", f"Retrieved {history_count} history items with proper structure")
                            return True
                    else:
                        self.log_test("History Endpoint", "FAIL", "No history items found")
                        return False
                else:
                    self.log_test("History Endpoint", "FAIL", "Missing 'history' or 'count' in response")
                    return False
            else:
                self.log_test("History Endpoint", "FAIL", f"Status code: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("History Endpoint", "FAIL", f"Exception: {str(e)}")
            return False
    
    def test_text_to_sign(self):
        """Test text to sign language endpoint"""
        test_cases = [
            {"text": "Hello", "sign_language": "ASL"},
            {"text": "Thank you", "sign_language": "BSL"},
            {"text": "Good morning", "sign_language": "ISL"}
        ]
        
        all_passed = True
        
        for case in test_cases:
            try:
                payload = {
                    "text": case["text"],
                    "sign_language": case["sign_language"],
                    "service": "openai"
                }
                
                response = self.session.post(f"{self.backend_url}/text-to-sign", json=payload)
                
                if response.status_code == 200:
                    data = response.json()
                    required_fields = ["id", "text", "sign_description", "sign_language", "service", "timestamp"]
                    
                    missing_fields = [field for field in required_fields if field not in data]
                    if missing_fields:
                        self.log_test(f"Text to Sign - {case['sign_language']}", "FAIL", f"Missing fields: {missing_fields}")
                        all_passed = False
                    elif data["sign_description"] and len(data["sign_description"]) > 10:
                        self.log_test(f"Text to Sign - {case['sign_language']}", "PASS", f"Generated description for '{case['text']}'")
                    else:
                        self.log_test(f"Text to Sign - {case['sign_language']}", "FAIL", "Sign description too short or empty")
                        all_passed = False
                else:
                    self.log_test(f"Text to Sign - {case['sign_language']}", "FAIL", f"Status code: {response.status_code}, Response: {response.text}")
                    all_passed = False
                    
            except Exception as e:
                self.log_test(f"Text to Sign - {case['sign_language']}", "FAIL", f"Exception: {str(e)}")
                all_passed = False
        
        return all_passed
    
    def test_voice_translation_error_handling(self):
        """Test voice translation endpoint error handling (without actual audio)"""
        try:
            # Test with missing audio_base64
            payload = {
                "source_language": "en",
                "target_language": "es",
                "service": "openai"
            }
            
            response = self.session.post(f"{self.backend_url}/voice-translate", json=payload)
            
            if response.status_code in [400, 422]:
                self.log_test("Voice Translation - Missing Audio", "PASS", f"Correctly rejected missing audio with status {response.status_code}")
                return True
            else:
                self.log_test("Voice Translation - Missing Audio", "FAIL", f"Expected 400/422, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Voice Translation - Missing Audio", "FAIL", f"Exception: {str(e)}")
            return False
    
    def test_sign_to_text_error_handling(self):
        """Test sign to text endpoint error handling (without actual image)"""
        try:
            # Test with missing image_base64
            payload = {
                "target_language": "en",
                "service": "openai"
            }
            
            response = self.session.post(f"{self.backend_url}/sign-to-text", json=payload)
            
            if response.status_code in [400, 422]:
                self.log_test("Sign to Text - Missing Image", "PASS", f"Correctly rejected missing image with status {response.status_code}")
                return True
            else:
                self.log_test("Sign to Text - Missing Image", "FAIL", f"Expected 400/422, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Sign to Text - Missing Image", "FAIL", f"Exception: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Universal Translation App Backend Tests")
        print(f"Backend URL: {self.backend_url}")
        print("=" * 60)
        
        tests = [
            ("Root Endpoint", self.test_root_endpoint),
            ("Supported Languages", self.test_supported_languages),
            ("Text Translation", self.test_text_translation),
            ("Translation Error Cases", self.test_translation_error_cases),
            ("History Endpoint", self.test_history_endpoint),
            ("Text to Sign", self.test_text_to_sign),
            ("Voice Translation Error Handling", self.test_voice_translation_error_handling),
            ("Sign to Text Error Handling", self.test_sign_to_text_error_handling)
        ]
        
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            print(f"\n📋 Running {test_name}...")
            try:
                if test_func():
                    passed += 1
            except Exception as e:
                print(f"❌ {test_name} failed with exception: {str(e)}")
        
        print("\n" + "=" * 60)
        print(f"📊 Test Summary: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️  {total - passed} tests failed")
            return False
    
    def print_detailed_results(self):
        """Print detailed test results"""
        print("\n📋 Detailed Test Results:")
        print("-" * 60)
        
        for result in self.test_results:
            status_symbol = "✅" if result["status"] == "PASS" else "❌"
            print(f"{status_symbol} {result['test']}")
            print(f"   Details: {result['details']}")
            if result.get('response_data'):
                print(f"   Data: {result['response_data']}")
            print()

if __name__ == "__main__":
    tester = TranslationAPITester()
    success = tester.run_all_tests()
    tester.print_detailed_results()
    
    sys.exit(0 if success else 1)