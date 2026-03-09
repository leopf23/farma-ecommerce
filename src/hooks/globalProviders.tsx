"use client";

import React from "react";
import StoreProviderAuthLogin from "./AuthLogin/StoreProvider";
import AuthInitializer from "./AuthLogin/AuthInitializer";
import StoreProviderCategories from "./Categories/StoreProvider";
import StoreProviderProducts from "./Products/StoreProvider";
import StoreProviderCart from "./Cart/StoreProvider";

export default function GlobalProviders({ children }: { children: React.ReactNode }) {
    return (
        <StoreProviderAuthLogin>
            <AuthInitializer>
                <StoreProviderCategories>
                    <StoreProviderProducts>
                        <StoreProviderCart>
                            {children}
                        </StoreProviderCart>
                    </StoreProviderProducts>
                </StoreProviderCategories>
            </AuthInitializer>
        </StoreProviderAuthLogin>
    );
}
